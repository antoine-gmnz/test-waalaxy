// src/services/queueProcessor.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function processQueue() {
  try {
    // First-in first-out -> Always get the 1st item in the queue
    const queueItem = await prisma.queue.findFirst();

    // If we don't have any items in queue, just return, nothing to do
    if (!queueItem || queueItem.actionIds.length === 0) {
      console.log('[SYSTEM] Queue not found or no actions in queue')
      return;
    }

    // Retrieve the action data
    const action = await prisma.action.findUnique({
      where: { id: queueItem.actionIds[0] },
    });

    if(!action) return

    await prisma.action.delete({
      where: {
        id: action.id
      }
    })
    console.log(`[SYSTEM] Deleted action ${action.id}`)

    const updatedActionIds = queueItem.actionIds.filter(id => id !== action.id);

    await prisma.queue.update({
      where: { id: queueItem.id },
      data: {
        actionIds: updatedActionIds
      },
    })
    console.log(`[SYSTEM] Deleted action from queue ${action.id}`)

    if(!action) return

  } catch (error) {
    console.error('Queue processing failed:', error);
  }
}

export default function startProcessQueue() {
  setInterval(processQueue, 15000);
}
