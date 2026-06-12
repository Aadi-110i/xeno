const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah', 'Isabella', 'James',
  'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Alexander', 'Harper', 'Mason', 'Evelyn', 'Ethan',
  'Abigail', 'Logan', 'Emily', 'Daniel', 'Elizabeth', 'Michael', 'Sofia', 'William', 'Avery', 'Jackson',
  'Ella', 'Sebastian', 'Madison', 'Mateo', 'Scarlett', 'Jack', 'Victoria', 'Owen', 'Aria', 'Theodore',
  'Grace', 'Aiden', 'Chloe', 'Samuel', 'Camila', 'Joseph', 'Penelope', 'John', 'Riley', 'David'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const PRODUCT_CATEGORIES = [
  { name: 'Classic Leather Sneakers', price: 89.99, category: 'Footwear' },
  { name: 'Minimalist Cotton T-Shirt', price: 24.99, category: 'Apparel' },
  { name: 'Slim Fit Denim Jeans', price: 59.99, category: 'Apparel' },
  { name: 'Waterproof Sports Watch', price: 129.99, category: 'Accessories' },
  { name: 'Wireless Noise-Cancelling Headphones', price: 199.99, category: 'Electronics' },
  { name: 'Leather Bifold Wallet', price: 45.00, category: 'Accessories' },
  { name: 'Stainless Steel Water Bottle', price: 30.00, category: 'Lifestyle' },
  { name: 'Ergonomic Canvas Backpack', price: 75.00, category: 'Accessories' },
  { name: 'Merino Wool Sweater', price: 85.00, category: 'Apparel' },
  { name: 'Polarized Sunglasses', price: 110.00, category: 'Accessories' }
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(daysAgoStart, daysAgoEnd) {
  const date = new Date();
  const daysAgo = daysAgoStart + Math.random() * (daysAgoEnd - daysAgoStart);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

async function main() {
  console.log('Clearing existing database...');
  await prisma.order.deleteMany({});
  await prisma.communicationLog.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.segment.deleteMany({});
  await prisma.customer.deleteMany({});

  console.log('Seeding customers...');
  const customers = [];
  const emailsUsed = new Set();
  const phonesUsed = new Set();

  for (let i = 0; i < 120; i++) {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    let count = 1;
    while (emailsUsed.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${count}@example.com`;
      count++;
    }
    emailsUsed.add(email);

    let phone = `+1${Math.floor(200 + Math.random() * 800)}${Math.floor(200 + Math.random() * 800)}${Math.floor(1000 + Math.random() * 9000)}`;
    while (phonesUsed.has(phone)) {
      phone = `+1${Math.floor(200 + Math.random() * 800)}${Math.floor(200 + Math.random() * 800)}${Math.floor(1000 + Math.random() * 9000)}`;
    }
    phonesUsed.add(phone);

    const customFields = JSON.stringify({
      age: Math.floor(18 + Math.random() * 50),
      preferredCategory: getRandomElement(['Apparel', 'Footwear', 'Accessories', 'Electronics', 'Lifestyle']),
      newsletterSubscribed: Math.random() > 0.3
    });

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        customFields,
        totalSpent: 0.0 // updated after orders are added
      }
    });
    customers.push(customer);
  }

  console.log(`Successfully seeded ${customers.length} customers.`);

  console.log('Seeding historical orders...');
  const ordersCount = 250;
  const orders = [];

  for (let i = 0; i < ordersCount; i++) {
    const customer = getRandomElement(customers);
    
    // Create random list of items for this order (1-3 items)
    const itemsCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let orderAmount = 0;
    
    for (let j = 0; j < itemsCount; j++) {
      const prod = getRandomElement(PRODUCT_CATEGORIES);
      const qty = Math.floor(Math.random() * 2) + 1;
      items.push({
        name: prod.name,
        price: prod.price,
        quantity: qty,
        category: prod.category
      });
      orderAmount += prod.price * qty;
    }

    // Round amount
    orderAmount = Math.round(orderAmount * 100) / 100;

    const purchaseDate = getRandomDate(1, 90); // past 90 days

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        amount: orderAmount,
        items: JSON.stringify(items),
        purchaseDate
      }
    });
    orders.push(order);
  }

  console.log(`Successfully seeded ${orders.length} orders.`);

  console.log('Recalculating customer total spent...');
  for (const customer of customers) {
    const customerOrders = await prisma.order.findMany({
      where: { customerId: customer.id }
    });
    
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.amount, 0);
    const roundedSpent = Math.round(totalSpent * 100) / 100;

    await prisma.customer.update({
      where: { id: customer.id },
      data: { totalSpent: roundedSpent }
    });
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
