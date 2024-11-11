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

const deleteActionFromQueue = async (actionId: string): Promise<null> => {
  const queue = await prisma.queue.findFirst();

  if (!queue) return null;

  const newActionIds = queue.actionIds.filter((id) => id !== actionId);
  await prisma.queue.update({
    where: { id: queue.id },
    data: {
      actionIds: newActionIds,
    },
  });

  return null;
};

const getQueueDetails = async () => {
  return await prisma.queue.findFirst();
};

export { addActionToQueue, deleteActionFromQueue, getQueueDetails };
