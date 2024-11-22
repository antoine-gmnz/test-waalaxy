import { deleteAction, getActionById } from '../service/action.service';
import {
  getAllActionTypes,
  updateActionTypeCredits,
} from '../service/actionType.service';
import { Action, Queue } from '@prisma/client';
import prisma from '../db/db';
import { logger } from '../utils/logger';

// Helper function: Get the next action with available credits
export async function getNextActionWithCredits(
  queue: Queue
): Promise<Action | null> {
  for (const actionId of queue.actionIds) {
    const action = await getActionById(actionId);
    if (!action) continue;

    const actionType = await getAllActionTypes();
    const matchingActionType = actionType.find(
      (at) => at.id === action.actionTypeId
    );

    if (matchingActionType && matchingActionType.credits > 0) {
      return action;
    }
  }
  logger.debug('No executable actions found');
  return null;
}

// Helper function: Execute action by consuming one credit
export async function executeAction(action: Action) {
  const actionType = await getAllActionTypes();
  const matchingActionType = actionType.find(
    (at) => at.id === action.actionTypeId
  );

  if (matchingActionType) {
    await updateActionTypeCredits(
      matchingActionType.id,
      matchingActionType.credits - 1
    );
    logger.debug(
      `Executed action: ${action.name}, remaining credits: ${
        matchingActionType.credits - 1
      }`
    );
  }
}

export async function removeActionFromQueue(queueId: string, actionId: string) {
  // Remove actionId from the queue's actionIds array
  await prisma.queue.update({
    where: { id: queueId },
    data: {
      actionIds: {
        set:
          (
            await prisma.queue.findUnique({ where: { id: queueId } })
          )?.actionIds.filter((id) => id !== actionId) || [],
      },
    },
  });

  // Delete the action from the Action collection
  await deleteAction(actionId);
}

// Main function: Process the queue every 15 seconds
export async function processQueue() {
  const queue = await prisma.queue.findFirst();
  if (!queue) return;

  const action = await getNextActionWithCredits(queue);
  if (action) {
    await executeAction(action);
    await removeActionFromQueue(queue.id, action.id);
    await prisma.queue.update({
      where: { id: queue.id },
      data: { lastExecutedTime: new Date() },
    });
  }
}

export default function startProcessQueue() {
  setInterval(processQueue, 15000);
}
