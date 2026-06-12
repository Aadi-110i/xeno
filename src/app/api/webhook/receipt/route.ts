import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { logId, campaignId, status, timestamp, purchase } = payload;

    if (!logId || !status) {
      return NextResponse.json({ error: 'Missing logId or status' }, { status: 400 });
    }

    console.log(`[CRM Webhook] Processing: logId=${logId}, status=${status}`);

    // Find the communication log
    const log = await prisma.communicationLog.findUnique({
      where: { id: logId }
    });

    if (!log) {
      return NextResponse.json({ error: `Communication log ${logId} not found` }, { status: 404 });
    }

    // Determine status timestamp update
    const updateData: any = {
      status,
      updatedAt: new Date(timestamp || Date.now())
    };

    if (status === 'sent') {
      updateData.sentAt = new Date(timestamp || Date.now());
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date(timestamp || Date.now());
    } else if (status === 'failed') {
      updateData.failedAt = new Date(timestamp || Date.now());
    } else if (status === 'opened') {
      updateData.openedAt = new Date(timestamp || Date.now());
    } else if (status === 'clicked') {
      updateData.clickedAt = new Date(timestamp || Date.now());
    } else if (status === 'converted') {
      updateData.convertedAt = new Date(timestamp || Date.now());
    }

    let result;

    // Only use transaction if dealing with purchase conversions to avoid lock contention
    if (status === 'converted' && purchase) {
      result = await prisma.$transaction(async (tx) => {
        // Prevent duplicate conversion orders
        const existingOrder = await tx.order.findFirst({
          where: { commLogId: logId }
        });

        if (!existingOrder) {
          console.log(`[CRM Webhook] Creating conversion order of $${purchase.amount} for customer ${log.customerId}`);
          
          await tx.order.create({
            data: {
              customerId: log.customerId,
              amount: purchase.amount,
              items: JSON.stringify(purchase.items),
              commLogId: logId,
              purchaseDate: new Date()
            }
          });

          await tx.customer.update({
            where: { id: log.customerId },
            data: {
              totalSpent: {
                increment: purchase.amount
              }
            }
          });
        }

        return await tx.communicationLog.update({
          where: { id: logId },
          data: updateData
        });
      });
    } else {
      // Standard atomic update (extremely fast, no SQLite transaction locks)
      result = await prisma.communicationLog.update({
        where: { id: logId },
        data: updateData
      });
    }

    // Check campaign completion status
    const activeLogsCount = await prisma.communicationLog.count({
      where: {
        campaignId,
        status: {
          in: ['pending', 'sent']
        }
      }
    });

    if (activeLogsCount === 0) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
      });
      if (campaign && campaign.status === 'running') {
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { status: 'completed' }
        });
        console.log(`[CRM Webhook] Campaign ${campaignId} status marked as COMPLETED`);
      }
    }

    return NextResponse.json({ success: true, updatedLog: result });
  } catch (err: any) {
    console.error(`[CRM Webhook Error]:`, err.message);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
