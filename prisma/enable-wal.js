const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Enabling WAL mode on SQLite database...');
  const result = await prisma.$queryRawUnsafe('PRAGMA journal_mode=WAL;');
  console.log('Result:', result);
  const currentMode = await prisma.$queryRawUnsafe('PRAGMA journal_mode;');
  console.log('Current journal mode:', currentMode);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
