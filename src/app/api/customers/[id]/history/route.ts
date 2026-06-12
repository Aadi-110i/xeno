import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          orderBy: { purchaseDate: 'desc' }
        },
        commLogs: {
          include: {
            campaign: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({
      orders: customer.orders,
      commLogs: customer.commLogs
    });
  } catch (err: any) {
    console.error('[GET Customer History Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
