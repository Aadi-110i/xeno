import { NextResponse } from 'next/server';
import { getCopilotResponse } from '@/lib/aiHelper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, apiKey } = body;

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const chatHistory = history || [];
    const result = await getCopilotResponse(message, chatHistory, apiKey);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[AI Chat Route Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
