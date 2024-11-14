import {
  addActionToQueue,
  deleteActionFromQueue,
  upsertQueue,
} from '../../service/queue.service';
import prisma from '../../db/db';

jest.mock('../../db/db', () => ({
  queue: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Queue Service', () => {
  describe('addActionToQueue', () => {
    it('should add an action ID to the queue', async () => {
      const actionId = 'action-1';
      const queue = {
        id: 'queue-1',
        actionIds: ['action-2'],
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      };

      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(queue);
      (prisma.queue.update as jest.Mock).mockResolvedValue(null);

      await addActionToQueue(actionId);

      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: queue.id },
        data: {
          updatedAt: expect.any(Date),
          lastExecutedTime: expect.any(Date),
          actionIds: { push: actionId },
        },
      });
    });

    it('should call upsertQueue if no queue is found', async () => {
      const actionId = 'action-1';

      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.queue.create as jest.Mock).mockResolvedValue({
        id: 'queue-1',
        actionIds: [],
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      });

      await addActionToQueue(actionId);

      expect(prisma.queue.create).toHaveBeenCalled();
    });
  });

  describe('deleteActionFromQueue', () => {
    it('should remove an action ID from the queue', async () => {
      const actionId = 'action-1';
      const queue = {
        id: 'queue-1',
        actionIds: ['action-1', 'action-2'],
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      };

      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(queue);
      (prisma.queue.update as jest.Mock).mockResolvedValue(null);

      await deleteActionFromQueue(actionId);

      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: queue.id },
        data: { actionIds: ['action-2'] },
      });
    });

    it('should return null if no queue is found', async () => {
      const actionId = 'action-1';

      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await deleteActionFromQueue(actionId);

      expect(result).toBeNull();
    });
  });

  describe('upsertQueue', () => {
    it('should return an existing queue', async () => {
      const queue = {
        id: 'queue-1',
        actionIds: ['action-1'],
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      };

      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(queue);

      const result = await upsertQueue();

      expect(prisma.queue.findFirst).toHaveBeenCalled();
      expect(result).toEqual(queue);
    });

    it('should create a new queue if none exists', async () => {
      const newQueue = {
        id: 'queue-1',
        actionIds: [],
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      };

      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.queue.create as jest.Mock).mockResolvedValue(newQueue);

      const result = await upsertQueue();

      expect(prisma.queue.create).toHaveBeenCalled();
      expect(result).toEqual(newQueue);
    });
  });
});
