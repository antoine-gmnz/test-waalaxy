import {
  createActionWithPersistance,
  deletePersistedAction,
  getActionFromDb,
} from '../../controller/action.controller';
import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import {
  createAction,
  deleteAction,
  getActionById,
} from '../../service/action.service';
import {
  addActionToQueue,
  deleteActionFromQueue,
} from '../../service/queue.service';
import { getActionTypeById } from '../../service/actionType.service';

jest.mock('../../service/action.service');
jest.mock('../../service/queue.service');
jest.mock('../../service/actionType.service');

describe('Controller Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  describe('createActionWithPersistance', () => {
    it('should return 404 if action type is not found', async () => {
      (getActionTypeById as jest.Mock).mockResolvedValue(null);
      req.body = { actionTypeId: '123', name: 'Test Action' };

      await createActionWithPersistance(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch action type',
      });
    });

    it('should return 500 if action creation fails', async () => {
      (getActionTypeById as jest.Mock).mockResolvedValue({ id: '123' });
      (createAction as jest.Mock).mockResolvedValue(null);
      req.body = { actionTypeId: '123', name: 'Test Action' };

      await createActionWithPersistance(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        HttpStatusCode.InternalServerError
      );
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create action',
      });
    });

    it('should return 201 and created action if successful', async () => {
      const createdAction = {
        id: '456',
        name: 'Test Action',
        actionTypeId: '123',
      };
      (getActionTypeById as jest.Mock).mockResolvedValue({ id: '123' });
      (createAction as jest.Mock).mockResolvedValue(createdAction);
      req.body = { actionTypeId: '123', name: 'Test Action' };

      await createActionWithPersistance(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Created);
      expect(res.json).toHaveBeenCalledWith(createdAction);
      expect(addActionToQueue).toHaveBeenCalledWith(createdAction.id);
    });
  });

  describe('deletePersistedAction', () => {
    it('should return 404 if action deletion or queue removal fails', async () => {
      (deleteAction as jest.Mock).mockResolvedValue(false);
      (deleteActionFromQueue as jest.Mock).mockResolvedValue(false);
      req.body = { id: '456' };

      await deletePersistedAction(req as any, res as Response);

      expect(res.sendStatus).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    });

    it('should return 200 if action and queue deletion succeed', async () => {
      (deleteAction as jest.Mock).mockResolvedValue(true);
      (deleteActionFromQueue as jest.Mock).mockResolvedValue(true);
      req.body = { id: '456' };

      await deletePersistedAction(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
      expect(res.json).toHaveBeenCalledWith({ deleteActionResult: true });
    });
  });

  describe('getActionFromDb', () => {
    it('should return 404 if action is not found', async () => {
      (getActionById as jest.Mock).mockResolvedValue(null);
      req.params = { id: '456' };

      await getActionFromDb(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 200 with action data if found', async () => {
      const action = { id: '456', name: 'Test Action' };
      (getActionById as jest.Mock).mockResolvedValue(action);
      req.params = { id: '456' };

      await getActionFromDb(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
      expect(res.send).toHaveBeenCalledWith(action);
    });
  });
});
