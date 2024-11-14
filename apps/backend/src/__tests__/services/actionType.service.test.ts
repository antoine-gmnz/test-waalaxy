import {
  getAllActionTypes,
  updateActionTypeCredits,
  getActionTypeById,
} from '../../service/actionType.service';
import prisma from '../../db/db';
import { ActionType } from '@prisma/client';

jest.mock('../../db/db', () => ({
  actionType: {
    findMany: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
}));

describe('Action Type Service', () => {
  describe('getAllActionTypes', () => {
    it('should return all action types', async () => {
      const actionTypes: ActionType[] = [
        {
          id: '1',
          name: 'ActionType 1',
          credits: 10,
          maxCredits: 20,
        },
        {
          id: '2',
          name: 'ActionType 2',
          credits: 20,
          maxCredits: 20,
        },
      ];

      (prisma.actionType.findMany as jest.Mock).mockResolvedValue(actionTypes);

      const result = await getAllActionTypes();

      expect(prisma.actionType.findMany).toHaveBeenCalled();
      expect(result).toEqual(actionTypes);
    });
  });

  describe('updateActionTypeCredits', () => {
    it('should update the credits of an action type', async () => {
      const actionTypeId = '1';
      const newCredits = 30;
      const updatedActionType: ActionType = {
        id: actionTypeId,
        name: 'ActionType 1',
        credits: newCredits,
        maxCredits: 20,
      };

      (prisma.actionType.update as jest.Mock).mockResolvedValue(
        updatedActionType
      );

      const result = await updateActionTypeCredits(actionTypeId, newCredits);

      expect(prisma.actionType.update).toHaveBeenCalledWith({
        where: { id: actionTypeId },
        data: { credits: newCredits },
      });
      expect(result).toEqual(updatedActionType);
    });
  });

  describe('getActionTypeById', () => {
    it('should return the action type if found', async () => {
      const actionTypeId = '1';
      const actionType: ActionType = {
        id: actionTypeId,
        name: 'ActionType 1',
        credits: 10,
        maxCredits: 10,
      };

      (prisma.actionType.findFirst as jest.Mock).mockResolvedValue(actionType);

      const result = await getActionTypeById(actionTypeId);

      expect(prisma.actionType.findFirst).toHaveBeenCalledWith({
        where: { id: actionTypeId },
      });
      expect(result).toEqual(actionType);
    });

    it('should return null if action type not found', async () => {
      const actionTypeId = '1';

      (prisma.actionType.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getActionTypeById(actionTypeId);

      expect(result).toBeNull();
    });
  });
});
