import prisma from '../db/db';

const addActionToQueue = async (actionId: string): Promise<null> => {
  const queue = await upsertQueue();

  await prisma.queue.update({
    where: {
      id: queue.id,
    },
    data: {
      updatedAt: new Date(),
      lastExecutedTime: new Date(),
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

const upsertQueue = async () => {
  let queue = await prisma.queue.findFirst();

  if (!queue) {
    queue = await prisma.queue.create({
      data: {
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      },
    });
  }
  return queue;
};

export { addActionToQueue, deleteActionFromQueue, upsertQueue };
