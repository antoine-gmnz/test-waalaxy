import {
  createAction,
  deleteAction,
  getActionById,
} from '../../service/action.service';
import prisma from '../../db/db';
import { Action } from '@prisma/client';

jest.mock('../../db/db', () => ({
  action: {
    create: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
}));

describe('Action Service', () => {
  describe('createAction', () => {
    it('should create and return a new action', async () => {
      const newAction = { actionTypeId: '123', name: 'Test Action' };
      const createdAction: Action = {
        id: '1',
        ...newAction,
        createdAt: new Date(),
      };

      (prisma.action.create as jest.Mock).mockResolvedValue(createdAction);

      const result = await createAction(newAction);

      expect(prisma.action.create).toHaveBeenCalledWith({
        data: { ...newAction },
      });
      expect(result).toEqual(createdAction);
    });

    it('should return null if action creation fails', async () => {
      const newAction = { actionTypeId: '123', name: 'Test Action' };

      (prisma.action.create as jest.Mock).mockResolvedValue(null);

      const result = await createAction(newAction);

      expect(result).toBeNull();
    });
  });

  describe('deleteAction', () => {
    it('should delete the action and return true', async () => {
      const actionId = '1';

      (prisma.action.delete as jest.Mock).mockResolvedValue(true);

      const result = await deleteAction(actionId);

      expect(prisma.action.delete).toHaveBeenCalledWith({
        where: { id: actionId },
      });
      expect(result).toBe(true);
    });

    it('should return false if delete fails', async () => {
      const actionId = '1';

      (prisma.action.delete as jest.Mock).mockResolvedValue(false);

      const result = await deleteAction(actionId);

      expect(result).toBe(false);
    });
  });

  describe('getActionById', () => {
    it('should return the action if found', async () => {
      const actionId = '1';
      const action: Action = {
        id: actionId,
        actionTypeId: '123',
        name: 'Test Action',
        createdAt: new Date(),
      };

      (prisma.action.findFirst as jest.Mock).mockResolvedValue(action);

      const result = await getActionById(actionId);

      expect(prisma.action.findFirst).toHaveBeenCalledWith({
        where: { id: actionId },
      });
      expect(result).toEqual(action);
    });

    it('should return null if action not found', async () => {
      const actionId = '1';

      (prisma.action.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getActionById(actionId);

      expect(result).toBeNull();
    });
  });
});
