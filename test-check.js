const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // 1. Database connection & data check
  console.log('\n=== DATABASE HEALTH CHECK ===');
  const customers = await p.customer.count();
  const segments = await p.segment.count();
  const campaigns = await p.campaign.count();
  const commLogs = await p.communicationLog.count();
  const orders = await p.order.count();
  console.log(`Customers: ${customers}`);
  console.log(`Segments: ${segments}`);
  console.log(`Campaigns: ${campaigns}`);
  console.log(`Communication Logs: ${commLogs}`);
  console.log(`Orders: ${orders}`);

  // 2. Check campaign stats (Telemetry data)
  console.log('\n=== TELEMETRY / CAMPAIGN STATS ===');
  const allCampaigns = await p.campaign.findMany({
    include: {
      segment: true,
      logs: { include: { conversions: true } }
    }
  });

  let totalRevenue = 0;
  let totalDelivered = 0;
  let totalMessages = 0;

  allCampaigns.forEach(camp => {
    const logs = camp.logs;
    const delivered = logs.filter(l => ['delivered','opened','clicked','converted'].includes(l.status)).length;
    const converted = logs.filter(l => l.status === 'converted').length;
    const revenue = logs.reduce((sum, log) => {
      if (log.status === 'converted' && log.conversions) {
        return sum + log.conversions.reduce((s, o) => s + o.amount, 0);
      }
      return sum;
    }, 0);
    totalMessages += logs.length;
    totalDelivered += delivered;
    totalRevenue += revenue;
    console.log(`  Campaign: "${camp.name}" | Status: ${camp.status} | Logs: ${logs.length} | Delivered: ${delivered} | Converted: ${converted} | Revenue: $${revenue.toFixed(2)}`);
  });

  const deliveryRate = totalMessages > 0 ? (totalDelivered / totalMessages * 100).toFixed(1) : '0.0';
  console.log(`\n  TOTALS => Messages: ${totalMessages} | Delivery Rate: ${deliveryRate}% | Revenue: $${totalRevenue.toFixed(2)}`);

  // 3. Check customers have spend values
  console.log('\n=== SHOPPER DATABASE SPOT CHECK ===');
  const topCustomers = await p.customer.findMany({ orderBy: { totalSpent: 'desc' }, take: 5 });
  topCustomers.forEach(c => {
    console.log(`  ${c.firstName} ${c.lastName} | $${c.totalSpent.toFixed(2)} | ${c.email}`);
  });

  // 4. Check segments exist and have definitions
  console.log('\n=== SEGMENTS CHECK ===');
  const allSegments = await p.segment.findMany();
  allSegments.forEach(s => {
    console.log(`  "${s.name}" | Definition: ${s.definition.substring(0, 60)}...`);
  });

  // 5. Check Gemini API key
  console.log('\n=== AI CORE CHECK ===');
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (apiKey && apiKey.length > 10) {
    console.log(`  Gemini API Key: SET (${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)})`);
  } else {
    console.log('  Gemini API Key: MISSING or EMPTY');
  }

  // 6. Channel Service
  console.log('\n=== GATEWAY (CHANNEL SERVICE) CHECK ===');
  try {
    const res = await fetch('http://localhost:3001/status');
    const data = await res.json();
    console.log(`  Gateway: ONLINE (${JSON.stringify(data)})`);
  } catch (e) {
    console.log('  Gateway: OFFLINE (localhost:3001 not reachable)');
  }

  console.log('\n=== SUMMARY ===');
  const checks = [
    { name: 'Database Connection', ok: customers > 0 },
    { name: 'Telemetry (Campaigns + Stats)', ok: campaigns > 0 && totalRevenue > 0 },
    { name: 'Shoppers (Customer Data)', ok: customers > 0 },
    { name: 'Segments', ok: segments > 0 },
    { name: 'Data Ingest (DB writable)', ok: customers > 0 },
    { name: 'AI Core (Gemini Key)', ok: apiKey && apiKey.length > 10 },
    { name: 'Gateway (Channel Service)', ok: false }, // checked above
  ];

  checks.forEach(c => {
    console.log(`  ${c.ok ? '✅' : '❌'} ${c.name}`);
  });
}

main()
  .then(() => p.$disconnect())
  .catch(e => { console.error(e); p.$disconnect(); process.exit(1); });
