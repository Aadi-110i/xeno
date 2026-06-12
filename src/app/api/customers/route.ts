import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { compileSegmentToPrisma, filterCustomersByRules } from '@/lib/segmentCompiler';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const segmentId = searchParams.get('segmentId');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (segmentId) {
      const segment = await prisma.segment.findUnique({
        where: { id: segmentId }
      });

      if (!segment) {
        return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
      }

      const rules = JSON.parse(segment.definition);
      const prismaWhere = compileSegmentToPrisma(rules);

      const matchingCustomers = await prisma.customer.findMany({
        where: prismaWhere,
        include: { orders: true },
        take: limit * 2 // take extra for orderCount programmatic filtering
      });

      const filteredCustomers = filterCustomersByRules(matchingCustomers, rules);
      return NextResponse.json(filteredCustomers.slice(0, limit));
    }

    // Default: Return all customers
    const customers = await prisma.customer.findMany({
      include: { orders: true },
      take: limit,
      orderBy: { totalSpent: 'desc' }
    });

    return NextResponse.json(customers);
  } catch (err: any) {
    console.error('[GET Customers Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customers } = body;

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: 'Invalid payload. Expected { customers: [...] }' }, { status: 400 });
    }

    const createdCustomers = [];

    // Process each customer transactionally or sequentially
    for (const cust of customers) {
      const { firstName, lastName, email, phone, customFields, orders } = cust;

      if (!firstName || !lastName || !email || !phone) {
        return NextResponse.json({ error: 'Missing required customer details (firstName, lastName, email, phone)' }, { status: 400 });
      }

      const customFieldsStr = customFields 
        ? (typeof customFields === 'string' ? customFields : JSON.stringify(customFields))
        : null;

      // Use a transaction to create the customer, orders, and update the spent total
      const result = await prisma.$transaction(async (tx) => {
        // Check if customer already exists
        let customer = await tx.customer.findFirst({
          where: {
            OR: [
              { email },
              { phone }
            ]
          }
        });

        if (customer) {
          // Update custom fields or just merge
          customer = await tx.customer.update({
            where: { id: customer.id },
            data: {
              firstName,
              lastName,
              customFields: customFieldsStr || customer.customFields
            }
          });
        } else {
          customer = await tx.customer.create({
            data: {
              firstName,
              lastName,
              email,
              phone,
              customFields: customFieldsStr,
              totalSpent: 0
            }
          });
        }

        // Add orders if present
        let totalSpentIncrement = 0;
        if (orders && Array.isArray(orders)) {
          for (const order of orders) {
            const { amount, items, purchaseDate } = order;
            const itemsStr = items 
              ? (typeof items === 'string' ? items : JSON.stringify(items))
              : '[]';

            await tx.order.create({
              data: {
                customerId: customer.id,
                amount: parseFloat(amount) || 0,
                items: itemsStr,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date()
              }
            });

            totalSpentIncrement += parseFloat(amount) || 0;
          }
        }

        // Recalculate customer total spent
        const updatedCustomer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            totalSpent: {
              increment: totalSpentIncrement
            }
          },
          include: {
            orders: true
          }
        });

        return updatedCustomer;
      });

      createdCustomers.push(result);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${createdCustomers.length} customer records.`,
      customers: createdCustomers
    });

  } catch (err: any) {
    console.error('[POST Ingestion Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
