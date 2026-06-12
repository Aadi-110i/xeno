import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateSegmentFromPrompt } from '@/lib/aiHelper';
import { compileSegmentToPrisma, filterCustomersByRules } from '@/lib/segmentCompiler';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, apiKey } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const aiResult = await generateSegmentFromPrompt(prompt, apiKey);
    
    // Check how many customers match these generated rules
    let size = 0;
    let preview: any[] = [];
    try {
      const prismaWhere = compileSegmentToPrisma(aiResult.rules);
      const matchingCustomers = await prisma.customer.findMany({
        where: prismaWhere,
        include: { orders: true }
      });
      const filtered = filterCustomersByRules(matchingCustomers, aiResult.rules);
      size = filtered.length;
      preview = filtered.slice(0, 5); // return top 5 customers as preview
    } catch (dbErr) {
      console.error('Failed to run generated segment queries:', dbErr);
    }

    return NextResponse.json({
      ...aiResult,
      size,
      preview
    });
  } catch (err: any) {
    console.error('[AI Segment Route Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
