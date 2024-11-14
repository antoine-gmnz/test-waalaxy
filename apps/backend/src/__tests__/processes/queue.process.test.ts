import {
  processQueue,
  executeAction,
  getNextActionWithCredits,
  removeActionFromQueue,
} from '../../processes/queue.process';
import {
  getAllActionTypes,
  updateActionTypeCredits,
} from '../../service/actionType.service';
import { deleteAction, getActionById } from '../../service/action.service';
import prisma from '../../db/db';
import { Queue, Action } from '@prisma/client';

// Mock the necessary dependencies
jest.mock('../../service/actionType.service', () => ({
  getAllActionTypes: jest.fn(),
  updateActionTypeCredits: jest.fn(),
}));

jest.mock('../../service/action.service', () => ({
  getActionById: jest.fn(),
  deleteAction: jest.fn(),
}));

jest.mock('../../db/db', () => ({
  queue: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Queue Processing Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNextActionWithCredits', () => {
    it('should return the next executable action with available credits', async () => {
      const mockQueue: Queue = {
        id: 'queue1',
        actionIds: ['action1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      };
      const mockAction: Action = {
        id: 'action1',
        name: 'Action1',
        createdAt: new Date(),
        actionTypeId: 'type1',
      };

      (getActionById as jest.Mock).mockResolvedValue(mockAction);
      (getAllActionTypes as jest.Mock).mockResolvedValue([
        { id: 'type1', name: 'Type1', maxCredits: 10, credits: 5 },
      ]);

      const result = await getNextActionWithCredits(mockQueue);
      expect(result).toEqual(mockAction);
    });

    it('should return null if no action has available credits', async () => {
      const mockQueue: Queue = {
        id: 'queue1',
        actionIds: ['action1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      };
      const mockAction: Action = {
        id: 'action1',
        name: 'Action1',
        createdAt: new Date(),
        actionTypeId: 'type1',
      };

      (getActionById as jest.Mock).mockResolvedValue(mockAction);
      (getAllActionTypes as jest.Mock).mockResolvedValue([
        { id: 'type1', name: 'Type1', maxCredits: 10, credits: 0 },
      ]);

      const result = await getNextActionWithCredits(mockQueue);
      expect(result).toBeNull();
    });
  });

  describe('executeAction', () => {
    it('should update credits for the action type when executed', async () => {
      const mockAction: Action = {
        id: 'action1',
        name: 'Action1',
        createdAt: new Date(),
        actionTypeId: 'type1',
      };

      (getAllActionTypes as jest.Mock).mockResolvedValue([
        { id: 'type1', name: 'Type1', maxCredits: 10, credits: 5 },
      ]);

      await executeAction(mockAction);

      expect(updateActionTypeCredits).toHaveBeenCalledWith('type1', 4); // 5 - 1 credit consumed
    });

    it('should not update if action type is not found', async () => {
      const mockAction: Action = {
        id: 'action1',
        name: 'Action1',
        createdAt: new Date(),
        actionTypeId: 'type1',
      };

      (getAllActionTypes as jest.Mock).mockResolvedValue([]);

      await executeAction(mockAction);

      expect(updateActionTypeCredits).not.toHaveBeenCalled();
    });
  });

  describe('removeActionFromQueue', () => {
    it('should remove actionId from queue and delete action', async () => {
      const queueId = 'queue1';
      const actionId = 'action1';

      (prisma.queue.findUnique as jest.Mock).mockResolvedValue({
        id: queueId,
        actionIds: [actionId],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      });

      await removeActionFromQueue(queueId, actionId);

      // Check that the actionId was removed from the queue
      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: queueId },
        data: {
          actionIds: { set: [] },
        },
      });

      // Check that the action was deleted from the Action collection
      expect(deleteAction).toHaveBeenCalledWith(actionId);
    });
  });

  describe('processQueue', () => {
    it('should process the next action in the queue', async () => {
      const mockQueue: Queue = {
        id: 'queue1',
        actionIds: ['action1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastExecutedTime: new Date(),
      };
      const mockAction: Action = {
        id: 'action1',
        name: 'Action1',
        createdAt: new Date(),
        actionTypeId: 'type1',
      };

      (prisma.queue.findFirst as jest.Mock).mockResolvedValue(mockQueue);
      (getActionById as jest.Mock).mockResolvedValue(mockAction);
      (getAllActionTypes as jest.Mock).mockResolvedValue([
        { id: 'type1', name: 'Type1', maxCredits: 10, credits: 5 },
      ]);

      await processQueue();

      // Check that executeAction and removeActionFromQueue were called
      expect(updateActionTypeCredits).toHaveBeenCalledWith('type1', 4);
      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: mockQueue.id },
        data: { lastExecutedTime: expect.any(Date) },
      });
    });
  });
});
