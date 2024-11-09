import prisma from '../db/db';

const addActionToQueue = async (actionId: string): Promise<null> => {
  let queue = await prisma.queue.findFirst();

  if (!queue) {
    queue = await prisma.queue.create({
      data: {
        updatedAt: new Date(),
      },
    });
  }

  await prisma.queue.update({
    where: {
      id: queue.id,
    },
    data: {
      updatedAt: new Date(),
      actionIds: {
        push: actionId,
      },
    },
  });

  return null;
};

export { addActionToQueue };
