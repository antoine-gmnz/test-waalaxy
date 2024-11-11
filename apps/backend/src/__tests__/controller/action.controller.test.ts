import {
  createActionWithPersistance,
  deletePersistedAction,
} from '../../controller/action.controller';
import { createAction, deleteAction } from '../../service/action.service';
import { getBaseActionByName } from '../../service/baseAction.service';
import {
  addActionToQueue,
  deleteActionFromQueue,
} from '../../service/queue.service';
import { calculateCreditsForAction } from '../../utils/calculateCredits';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

jest.mock('../../service/action.service');
jest.mock('../../service/baseAction.service');
jest.mock('../../service/queue.service');
jest.mock('../../utils/calculateCredits');

describe('Action Controller', () => {
  const mockReq = {} as Request;
  const mockRes = {} as Response;
  mockRes.status = jest.fn().mockReturnThis();
  mockRes.json = jest.fn();
  mockRes.send = jest.fn();
  mockRes.sendStatus = jest.fn();

  describe('createActionWithPersistance', () => {
    it('should create an action and add it to the queue', async () => {
      const mockBaseAction = { id: 'base1', maxCredits: 100 };
      const mockAction = {
        id: 'action1',
        name: 'Test Action',
        credits: 80,
        maxCredits: 100,
        baseActionId: 'base1',
        updatedAt: new Date(),
      };

      (getBaseActionByName as jest.Mock).mockResolvedValue(mockBaseAction);
      (calculateCreditsForAction as jest.Mock).mockReturnValue(80);
      (createAction as jest.Mock).mockResolvedValue(mockAction);
      (addActionToQueue as jest.Mock).mockResolvedValue(null);

      mockReq.body = { name: 'Test Action' };

      await createActionWithPersistance(mockReq, mockRes);

      expect(getBaseActionByName).toHaveBeenCalledWith('Test Action');
      expect(createAction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Action',
          maxCredits: 100,
          credits: 80,
        })
      );
      expect(addActionToQueue).toHaveBeenCalledWith('action1');
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.Created);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'action1' })
      );
    });

    it('should return a 404 error if base action is not found', async () => {
      (getBaseActionByName as jest.Mock).mockResolvedValue(null);

      mockReq.body = { name: 'NonExistentAction' };

      await createActionWithPersistance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch base action',
      });
    });

    it('should return a 500 error if creation fails', async () => {
      (getBaseActionByName as jest.Mock).mockResolvedValue({
        id: 'base1',
        maxCredits: 100,
      });
      (calculateCreditsForAction as jest.Mock).mockReturnValue(80);
      (createAction as jest.Mock).mockResolvedValue(null);

      mockReq.body = { name: 'Test Action' };

      await createActionWithPersistance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(
        HttpStatusCode.InternalServerError
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to create action',
      });
    });
  });

  describe('deletePersistedAction', () => {
    it('should delete an action and remove it from the queue', async () => {
      (deleteAction as jest.Mock).mockResolvedValue(true);
      (deleteActionFromQueue as jest.Mock).mockResolvedValue(true);

      mockReq.body = { id: 'action1' };

      await deletePersistedAction(mockReq, mockRes);

      expect(deleteAction).toHaveBeenCalledWith('action1');
      expect(deleteActionFromQueue).toHaveBeenCalledWith('action1');
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
      expect(mockRes.json).toHaveBeenCalledWith({ deleteActionResult: true });
    });

    it('should throw a 404 error if action is not found', async () => {
      (deleteAction as jest.Mock).mockResolvedValue(false);
      (deleteActionFromQueue as jest.Mock).mockResolvedValue(false);

      mockReq.body = { id: 'nonExistentAction' };

      await deletePersistedAction(mockReq, mockRes);

      expect(deleteAction).toHaveBeenCalledWith('nonExistentAction');
      expect(mockRes.sendStatus).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    });

    it('should return 500 status on internal errors', async () => {
      (deleteAction as jest.Mock).mockRejectedValue(() => {
        throw new Error('Internal error');
      });

      mockReq.body = { id: 'action1' };

      await deletePersistedAction(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
