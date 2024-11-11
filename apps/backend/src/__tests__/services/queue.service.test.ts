import prisma from '../../db/db';
import {
  addActionToQueue,
  deleteActionFromQueue,
} from '../../service/queue.service';

jest.mock('../../db/db', () => ({
  queue: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Queue Service', () => {
  const actionId = 'action123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addActionToQueue', () => {
    it('should create a new queue and add the actionId when no queue exists', async () => {
      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.queue.create as jest.Mock).mockResolvedValue({
        id: 'queue1',
        actionIds: [],
        lastExecutionTime: 'something',
      });
      (prisma.queue.update as jest.Mock).mockResolvedValue(null);

      await addActionToQueue(actionId);

      expect(prisma.queue.create).toHaveBeenCalledWith({
        data: { updatedAt: expect.any(Date) },
      });
      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: 'queue1' },
        data: {
          updatedAt: expect.any(Date),
          actionIds: { push: actionId },
        },
      });
    });

    it('should add the actionId to an existing queue', async () => {
      const mockQueue = { id: 'queue1', actionIds: ['existingAction'] };
      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(mockQueue);
      (prisma.queue.update as jest.Mock).mockResolvedValue(null);

      await addActionToQueue(actionId);

      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: 'queue1' },
        data: {
          updatedAt: expect.any(Date),
          actionIds: { push: actionId },
        },
      });
      expect(prisma.queue.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteActionFromQueue', () => {
    it('should remove the actionId from the queue if present', async () => {
      const mockQueue = {
        id: 'queue1',
        actionIds: [actionId, 'anotherAction'],
      };
      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(mockQueue);
      (prisma.queue.update as jest.Mock).mockResolvedValue(null);

      await deleteActionFromQueue(actionId);

      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: 'queue1' },
        data: { actionIds: ['anotherAction'] },
      });
    });

    it('should return null if no queue exists', async () => {
      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await deleteActionFromQueue(actionId);

      expect(prisma.queue.findFirst).toHaveBeenCalled();
      expect(prisma.queue.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
