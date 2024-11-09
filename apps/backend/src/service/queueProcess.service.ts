// src/services/queueProcessor.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function processQueue() {
  const queueItem = await prisma.queue.findFirst({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
  });

  if (!queueItem) {
    return; // No pending items, exit early
  }

  // Mark as "processing"
  await prisma.queue.update({
    where: { id: queueItem.id },
    data: { status: 'processing' },
  });

  // Retrieve the action data
  const action = await prisma.action.findUnique({
    where: { id: queueItem.actionId },
  });

  if (!action) {
    // Handle missing action
    await prisma.queue.update({
      where: { id: queueItem.id },
      data: { status: 'failed' },
    });
    return;
  }

  // Execute action logic, e.g., calculate credits
  try {
    const credits = action.credits;

    // Perform the main action, such as updating the action with calculated credits
    await prisma.action.update({
      where: { id: action.id },
      data: { credits },
    });

    // Mark as "completed"
    await prisma.queue.update({
      where: { id: queueItem.id },
      data: { status: 'completed' },
    });
  } catch (error) {
    // Handle failure, mark as failed
    await prisma.queue.update({
      where: { id: queueItem.id },
      data: { status: 'failed' },
    });
    console.error('Queue processing failed:', error);
  }
}

// Set an interval to continuously process the queue
setInterval(processQueue, 5000); // Run every 5 seconds
