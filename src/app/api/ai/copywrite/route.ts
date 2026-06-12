import { NextResponse } from 'next/server';
import { generateMessageCopy } from '@/lib/aiHelper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { objective, channel, apiKey } = body;

    if (!objective || !channel) {
      return NextResponse.json({ error: 'Missing objective or channel' }, { status: 400 });
    }

    const result = await generateMessageCopy(objective, channel, apiKey);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[AI Copywrite Route Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
