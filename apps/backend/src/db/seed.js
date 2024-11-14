import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DATA = [
  {
    name: "A",
    maxCredits: 30,
    credits: 30
  },
  {
    name: "B",
    maxCredits: 10,
    credits: 10
  },
  {
    name: "C",
    maxCredits: 15,
    credits: 15
  }
]

async function main() {
  await prisma.actionType.deleteMany();
  await prisma.queue.deleteMany();
  await prisma.action.deleteMany();

  // We need the baseActionId to create the credits
  for (const item of DATA) {
    await prisma.actionType.create({
      data: { ...item }
    })
  }

  await prisma.queue.create({
    data: {
      actionIds: [],
      updatedAt: new Date(),
      lastExecutedTime: new Date()
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
