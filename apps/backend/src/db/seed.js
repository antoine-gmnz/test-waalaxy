import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DATA = [
  {
    name: "A",
    maxCredits: 10,
    baseCredits: 100
  },
  {
    name: "B",
    maxCredits: 14,
    baseCredits: 120
  },
  {
    name: "C",
    maxCredits: 20,
    baseCredits: 150
  }
]

async function main() {
  await prisma.baseAction.deleteMany();
  await prisma.credit.deleteMany();
  await prisma.queue.deleteMany();

  // We need the baseActionId to create the credits
  for (const item of DATA) {
    const result = await prisma.baseAction.create({
      data: {
        name: item.name,
        maxCredits: item.maxCredits
      }
    })

    if (result) {
      await prisma.credit.create({
        data: {
          baseActionId: result.id,
          creditNumber: item.baseCredits,
        }
      })
    }
  }

  await prisma.queue.create({
    data: {
      actionIds: [],
      updatedAt: new Date(),
      lastExecutionTime: new Date()
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
