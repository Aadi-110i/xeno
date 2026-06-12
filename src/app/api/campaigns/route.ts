import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        segment: true,
        logs: {
          include: {
            conversions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Compute stats for each campaign
    const campaignsWithStats = campaigns.map((campaign) => {
      const logs = campaign.logs;
      const sent = logs.filter(l => ['sent', 'delivered', 'opened', 'clicked', 'converted'].includes(l.status)).length;
      const delivered = logs.filter(l => ['delivered', 'opened', 'clicked', 'converted'].includes(l.status)).length;
      const failed = logs.filter(l => l.status === 'failed').length;
      const opened = logs.filter(l => ['opened', 'clicked', 'converted'].includes(l.status)).length;
      const clicked = logs.filter(l => ['clicked', 'converted'].includes(l.status)).length;
      const converted = logs.filter(l => l.status === 'converted').length;
      
      // Calculate revenue
      const revenue = logs.reduce((sum, log) => {
        if (log.status === 'converted' && log.conversions) {
          return sum + log.conversions.reduce((orderSum, order) => orderSum + order.amount, 0);
        }
        return sum;
      }, 0);

      // Clean logs from payload to keep it light
      const { logs: _, ...campaignData } = campaign;

      return {
        ...campaignData,
        stats: {
          total: logs.length,
          sent,
          delivered,
          failed,
          opened,
          clicked,
          converted,
          revenue: Math.round(revenue * 100) / 100
        }
      };
    });

    return NextResponse.json(campaignsWithStats);
  } catch (err: any) {
    console.error('[GET Campaigns Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, channel, messageTemplate, segmentId } = body;

    if (!name || !channel || !messageTemplate || !segmentId) {
      return NextResponse.json({ error: 'Missing required campaign fields' }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        channel,
        messageTemplate,
        segmentId,
        status: 'draft'
      },
      include: {
        segment: true
      }
    });

    return NextResponse.json(campaign);
  } catch (err: any) {
    console.error('[POST Campaign Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
