const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding fancy telemetry data...')

  // Clean existing data
  await prisma.order.deleteMany()
  await prisma.communicationLog.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.segment.deleteMany()
  await prisma.customer.deleteMany()

  // 1. Create Customers
  const customerData = [
    { firstName: 'Maximilian', lastName: 'Vanderbilt', email: 'max.v@luxury-corp.com', phone: '+15559871111', totalSpent: 2050.00, customFields: JSON.stringify({ tier: 'platinum', city: 'New York' }) },
    { firstName: 'Lucas', lastName: 'Anderson', email: 'lucas.anderson@example.com', phone: '+19086156031', totalSpent: 520.00, customFields: JSON.stringify({ tier: 'gold', city: 'San Francisco' }) },
    { firstName: 'Mia', lastName: 'Martinez', email: 'mia.martinez@example.com', phone: '+18202314831', totalSpent: 120.50, customFields: JSON.stringify({ tier: 'silver', city: 'Miami' }) },
    { firstName: 'Avery', lastName: 'Davis', email: 'avery.davis@example.com', phone: '+15768117740', totalSpent: 3400.00, customFields: JSON.stringify({ tier: 'platinum', city: 'Los Angeles' }) },
    { firstName: 'Benjamin', lastName: 'Martin', email: 'benjamin.martin@example.com', phone: '+15155527227', totalSpent: 890.00, customFields: JSON.stringify({ tier: 'gold', city: 'Chicago' }) },
    { firstName: 'Michael', lastName: 'Garcia', email: 'michael.garcia@example.com', phone: '+13333046325', totalSpent: 210.00, customFields: JSON.stringify({ tier: 'silver', city: 'Austin' }) },
    { firstName: 'Abigail', lastName: 'Jackson', email: 'abigail.jackson@example.com', phone: '+13287537506', totalSpent: 1550.00, customFields: JSON.stringify({ tier: 'platinum', city: 'Seattle' }) },
    { firstName: 'Emma', lastName: 'Hernandez', email: 'emma.hernandez@example.com', phone: '+19592854895', totalSpent: 45.00, customFields: JSON.stringify({ tier: 'bronze', city: 'Denver' }) },
  ]

  const customers = []
  for (const c of customerData) {
    customers.push(await prisma.customer.create({ data: c }))
  }

  // 2. Create Segments
  const segments = []
  segments.push(await prisma.segment.create({
    data: { name: 'High Spend Cohort', description: 'Lifetime value > $1000', definition: JSON.stringify({ field: 'totalSpent', operator: '>', value: 1000 }) }
  }))
  segments.push(await prisma.segment.create({
    data: { name: 'Gold Tier Engagement', description: 'Active gold tier members', definition: JSON.stringify({ field: 'customFields.tier', operator: '==', value: 'gold' }) }
  }))
  segments.push(await prisma.segment.create({
    data: { name: 'Dormant Bronze', description: 'Low spenders needing revival', definition: JSON.stringify({ field: 'customFields.tier', operator: '==', value: 'bronze' }) }
  }))

  // 3. Create Campaigns (Orchestrations)
  const campaigns = []
  campaigns.push(await prisma.campaign.create({
    data: { name: 'Summer Luxury Drop', description: 'Exclusive early access', channel: 'whatsapp', messageTemplate: 'Hi {{firstName}}, exclusive early access to our new drop is here.', segmentId: segments[0].id, status: 'completed' }
  }))
  campaigns.push(await prisma.campaign.create({
    data: { name: 'Gold Member Upgrades', description: 'Free shipping promo', channel: 'email', messageTemplate: 'Enjoy free shipping on your next order, {{firstName}}.', segmentId: segments[1].id, status: 'running' }
  }))
  campaigns.push(await prisma.campaign.create({
    data: { name: 'We Miss You 10%', description: 'Winback discount', channel: 'sms', messageTemplate: 'Come back {{firstName}} for 10% off your next purchase!', segmentId: segments[2].id, status: 'running' }
  }))
  campaigns.push(await prisma.campaign.create({
    data: { name: 'VIP Gala Invite', description: 'In-person event', channel: 'whatsapp', messageTemplate: 'You are invited to our VIP Gala in {{city}}.', segmentId: segments[0].id, status: 'scheduled' }
  }))

  // 4. Create Communication Logs & Attributed Orders
  const baseDate = new Date()
  
  // High Spenders Campaign (Summer Luxury Drop) -> High conversion!
  for (const customer of [customers[0], customers[3], customers[6]]) {
    const log = await prisma.communicationLog.create({
      data: {
        campaignId: campaigns[0].id,
        customerId: customer.id,
        channel: 'whatsapp',
        recipient: customer.phone,
        message: `Hi ${customer.firstName}, exclusive early access to our new drop is here.`,
        status: 'converted',
        sentAt: new Date(baseDate.getTime() - 86400000 * 2), // 2 days ago
        deliveredAt: new Date(baseDate.getTime() - 86400000 * 2 + 5000),
        openedAt: new Date(baseDate.getTime() - 86400000 * 2 + 3600000),
        clickedAt: new Date(baseDate.getTime() - 86400000 * 2 + 3700000),
        convertedAt: new Date(baseDate.getTime() - 86400000 * 1), // 1 day ago
      }
    })

    // Attributed Order
    await prisma.order.create({
      data: {
        customerId: customer.id,
        amount: Math.floor(Math.random() * 500) + 500, // $500 - $1000
        items: JSON.stringify([{ name: 'Luxury Item', price: 750 }]),
        purchaseDate: new Date(baseDate.getTime() - 86400000 * 1),
        commLogId: log.id // This ties the revenue to the campaign!
      }
    })
  }

  // Gold Member Campaign -> Some clicks, some conversions
  for (const customer of [customers[1], customers[4]]) {
    const isConverted = customer.firstName === 'Benjamin' // Make Benjamin convert
    const log = await prisma.communicationLog.create({
      data: {
        campaignId: campaigns[1].id,
        customerId: customer.id,
        channel: 'email',
        recipient: customer.email,
        message: `Enjoy free shipping on your next order, ${customer.firstName}.`,
        status: isConverted ? 'converted' : 'opened',
        sentAt: new Date(baseDate.getTime() - 43200000), // 12 hours ago
        deliveredAt: new Date(baseDate.getTime() - 43200000 + 2000),
        openedAt: new Date(baseDate.getTime() - 43200000 + 800000),
        clickedAt: isConverted ? new Date(baseDate.getTime() - 43200000 + 850000) : null,
        convertedAt: isConverted ? new Date(baseDate.getTime() - 3600000) : null, // 1 hr ago
      }
    })

    if (isConverted) {
      await prisma.order.create({
        data: {
          customerId: customer.id,
          amount: 250.00,
          items: JSON.stringify([{ name: 'Premium Accessory', price: 250 }]),
          purchaseDate: new Date(baseDate.getTime() - 3600000),
          commLogId: log.id
        }
      })
    }
  }

  // Bronze Campaign -> Mostly delivered/ignored
  for (const customer of [customers[2], customers[5], customers[7]]) {
    await prisma.communicationLog.create({
      data: {
        campaignId: campaigns[2].id,
        customerId: customer.id,
        channel: 'sms',
        recipient: customer.phone,
        message: `Come back ${customer.firstName} for 10% off your next purchase!`,
        status: 'delivered',
        sentAt: new Date(baseDate.getTime() - 7200000), // 2 hours ago
        deliveredAt: new Date(baseDate.getTime() - 7200000 + 1000),
      }
    })
  }

  // Create some regular non-attributed orders just to flesh out history
  await prisma.order.create({
    data: {
      customerId: customers[0].id,
      amount: 150.00,
      items: JSON.stringify([{ name: 'Basic Item', price: 150 }]),
      purchaseDate: new Date(baseDate.getTime() - 86400000 * 10),
    }
  })

  console.log('Fancy telemetry data seeded successfully! The ROI and metrics should look amazing now.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
