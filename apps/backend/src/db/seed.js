import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.baseAction.deleteMany();
  await prisma.baseAction.createMany({
    data: [
      { name: 'A', maxCredits: 100 },
      { name: 'B', maxCredits: 200 },
      { name: 'C', maxCredits: 300 },
    ],
  });
  await prisma.queue.create({
    data: {
      actionIds: [],
      updatedAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
