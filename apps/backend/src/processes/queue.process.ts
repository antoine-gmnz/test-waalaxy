// src/services/queueProcessor.ts
import { Action, PrismaClient, Queue } from '@prisma/client';

const prisma = new PrismaClient();

export async function processQueue() {
  try {
    const queueItem = await getQueueItem();
    if (!queueItem) return;

    // Loop through actionIds in the queue until one can be processed
    for (const actionId of queueItem.actionIds) {
      // Retrieve the action data
      const action = await prisma.action.findUnique({
        where: { id: actionId },
      });

      if (!action) return;

      // Check if user has enough credits, then update the queue to remove the action
      const isCreditNonNull = await checkCreditsAndUpdate(
        action.baseActionId,
        action.credits
      );

      // If return false, nothing was done
      if (isCreditNonNull) {
        // Delete action in queue
        await updateQueueActions(queueItem, action);

        // Remove action item
        await removeActionFromMongo(action);

        // Break the loop if everything goes fine
        break;
      }
    }
  } catch (error) {
    console.error('Queue processing failed:', error);
  }
}

const removeActionFromMongo = async (action: Action) => {
  await prisma.action.delete({
    where: {
      id: action.id,
    },
  });
};

const updateQueueActions = async (queueItem: Queue, action: Action) => {
  const updatedActionIds = queueItem.actionIds.filter((id) => id !== action.id);

  await prisma.queue.update({
    where: { id: queueItem.id },
    data: {
      actionIds: updatedActionIds,
    },
  });
};

const getQueueItem = async (): Promise<Queue | null> => {
  // First-in first-out -> Always get the 1st item in the queue
  const queueItem = await prisma.queue.findFirst();

  // If we don't have any items in queue, just return, nothing to do
  if (queueItem?.actionIds.length === 0) {
    return null;
  }
  return queueItem;
};

const checkCreditsAndUpdate = async (id: string, actionCost: number) => {
  const creditItem = await prisma.credit.findFirst({
    where: {
      baseActionId: id,
    },
  });

  if (creditItem && creditItem.creditNumber - actionCost >= 0) {
    await prisma.credit.update({
      where: {
        id: creditItem.id,
      },
      data: {
        creditNumber: creditItem.creditNumber - actionCost,
      },
    });
    return true;
  }
  return false;
};

export default function startProcessQueue() {
  setInterval(processQueue, 15000);
}
