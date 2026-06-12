import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { compileSegmentToPrisma, filterCustomersByRules } from '@/lib/segmentCompiler';

export async function GET() {
  try {
    const segments = await prisma.segment.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Compute active size for each segment
    const segmentsWithCounts = await Promise.all(
      segments.map(async (segment) => {
        try {
          const rules = JSON.parse(segment.definition);
          const prismaWhere = compileSegmentToPrisma(rules);

          const matchingCustomers = await prisma.customer.findMany({
            where: prismaWhere,
            include: { orders: true }
          });

          const filteredCustomers = filterCustomersByRules(matchingCustomers, rules);

          return {
            ...segment,
            size: filteredCustomers.length
          };
        } catch (e) {
          return {
            ...segment,
            size: 0
          };
        }
      })
    );

    return NextResponse.json(segmentsWithCounts);
  } catch (err: any) {
    console.error('[GET Segments Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, definition } = body;

    if (!name || !definition) {
      return NextResponse.json({ error: 'Missing name or definition' }, { status: 400 });
    }

    // Validate that definition parses into rules
    let rules = [];
    try {
      rules = typeof definition === 'string' ? JSON.parse(definition) : definition;
    } catch (e) {
      return NextResponse.json({ error: 'Definition must be valid JSON' }, { status: 400 });
    }

    const definitionString = typeof definition === 'string' ? definition : JSON.stringify(definition);

    // Compile prisma where to verify correctness
    const prismaWhere = compileSegmentToPrisma(rules);
    
    // Fetch count
    const matchingCustomers = await prisma.customer.findMany({
      where: prismaWhere,
      include: { orders: true }
    });
    const size = filterCustomersByRules(matchingCustomers, rules).length;

    const segment = await prisma.segment.create({
      data: {
        name,
        description,
        definition: definitionString,
        sqlQuery: JSON.stringify(prismaWhere) // cache prisma query
      }
    });

    return NextResponse.json({ ...segment, size });
  } catch (err: any) {
    console.error('[POST Segment Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
