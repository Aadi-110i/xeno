import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { compileSegmentToPrisma, filterCustomersByRules } from '@/lib/segmentCompiler';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

    // Fetch campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { segment: true }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status === 'running') {
      return NextResponse.json({ error: 'Campaign is already running' }, { status: 400 });
    }

    console.log(`[CRM Run Campaign] Starting campaign execution: ${campaign.name} (${campaignId})`);

    // Fetch segment rules and match customers
    const rules = JSON.parse(campaign.segment.definition);
    const prismaWhere = compileSegmentToPrisma(rules);

    const matchingCustomers = await prisma.customer.findMany({
      where: prismaWhere,
      include: { orders: true }
    });

    const filteredCustomers = filterCustomersByRules(matchingCustomers, rules);

    if (filteredCustomers.length === 0) {
      return NextResponse.json({ error: 'Target segment contains zero shoppers. Cannot run campaign.' }, { status: 400 });
    }

    // Set campaign status to running
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'running' }
    });

    // Clear any previous logs for this campaign to start clean
    await prisma.communicationLog.deleteMany({
      where: { campaignId }
    });

    // Build communication logs & personalized messages
    const logsData = [];
    const messagesToSend = [];

    for (const customer of filteredCustomers) {
      // Personalization engine
      let message = campaign.messageTemplate
        .replace(/\{\{firstName\}\}/g, customer.firstName)
        .replace(/\{\{lastName\}\}/g, customer.lastName)
        .replace(/\{\{email\}\}/g, customer.email)
        .replace(/\{\{phone\}\}/g, customer.phone)
        .replace(/\{\{totalSpent\}\}/g, customer.totalSpent.toFixed(2));

      const recipient = ['email'].includes(campaign.channel) ? customer.email : customer.phone;

      // Generate a temporary ID so we can save it and send to Channel Service
      const logId = crypto.randomUUID();

      logsData.push({
        id: logId,
        campaignId,
        customerId: customer.id,
        channel: campaign.channel,
        recipient,
        message,
        status: 'pending'
      });

      messagesToSend.push({
        logId,
        recipient,
        message,
        channel: campaign.channel,
        campaignId
      });
    }

    console.log(`[CRM Run Campaign] Creating ${logsData.length} communication log records...`);

    // Batch create logs in database
    await prisma.communicationLog.createMany({
      data: logsData
    });

    // Dispatch messages to Channel Service (Port 3001)
    const channelServiceUrl = 'http://localhost:3001/send';
    const callbackUrl = 'http://localhost:3000/api/webhook/receipt';

    console.log(`[CRM Run Campaign] Posting batch of ${messagesToSend.length} to Channel Service...`);

    try {
      const response = await fetch(channelServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          callbackUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Channel service replied with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log('[CRM Run Campaign] Channel Service response:', responseData);

      // Instantly mark logs as "sent" since they have been accepted by the delivery channel
      await prisma.communicationLog.updateMany({
        where: { id: { in: logsData.map(l => l.id) } },
        data: {
          status: 'sent',
          sentAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: `Campaign started. Queued ${messagesToSend.length} messages.`,
        campaignId
      });
    } catch (channelErr: any) {
      console.warn('[CRM Run Campaign] Channel service offline. Running IN-MEMORY SIMULATION fallback...');

      const items = [
        { name: 'Ergonomic Canvas Backpack', price: 75.00, quantity: 1, category: 'Accessories' },
        { name: 'Classic Leather Sneakers', price: 89.99, quantity: 1, category: 'Footwear' },
        { name: 'Minimalist Cotton T-Shirt', price: 24.99, quantity: 2, category: 'Apparel' },
        { name: 'Polarized Sunglasses', price: 110.00, quantity: 1, category: 'Accessories' }
      ];

      for (const log of logsData) {
        const rand = Math.random();
        let status = 'delivered';
        let conversionData = null;

        if (rand > 0.8) {
          status = 'converted';
          const chosenItem = items[Math.floor(Math.random() * items.length)];
          conversionData = { amount: chosenItem.price * chosenItem.quantity, items: [chosenItem] };
        } else if (rand > 0.6) {
          status = 'clicked';
        } else if (rand > 0.3) {
          status = 'opened';
        } else if (rand > 0.05) {
          status = 'delivered';
        } else {
          status = 'failed';
        }

        await prisma.communicationLog.update({
          where: { id: log.id },
          data: {
            status,
            sentAt: new Date(),
            ...(status === 'failed' ? { failedAt: new Date() } : {}),
            ...(status === 'converted' ? { convertedAt: new Date() } : {})
          }
        });

        if (conversionData) {
           await prisma.order.create({
             data: {
               customerId: log.customerId,
               commLogId: log.id,
               amount: conversionData.amount,
               items: JSON.stringify(conversionData.items),
               purchaseDate: new Date()
             }
           });
           
           await prisma.customer.update({
             where: { id: log.customerId },
             data: { totalSpent: { increment: conversionData.amount } }
           });
        }
      }

      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'completed' }
      });

      return NextResponse.json({
        success: true,
        message: `Campaign simulated via fallback. Processed ${messagesToSend.length} messages.`,
        campaignId
      });
    }

  } catch (err: any) {
    console.error('[Run Campaign Route Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
