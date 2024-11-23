import {
  createActionWithPersistance,
  deletePersistedAction,
  getActionFromDb,
} from '../../controller/action.controller';
import { NextFunction, Request, Response } from 'express';
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

describe('Actions Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('createActionWithPersistance', () => {
    it('should create an action and add it to the queue', async () => {
      const mockActionType = { id: '1', name: 'Test Action Type' };
      const mockAction = { id: '1', name: 'Test Action', actionTypeId: '1' };

      (getActionTypeById as jest.Mock).mockResolvedValue(mockActionType);
      (createAction as jest.Mock).mockResolvedValue(mockAction);
      (addActionToQueue as jest.Mock).mockResolvedValue(undefined);

      mockRequest.body = { name: 'Test Action', actionTypeId: '1' };

      await createActionWithPersistance(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getActionTypeById).toHaveBeenCalledWith('1');
      expect(createAction).toHaveBeenCalledWith({
        name: 'Test Action',
        actionTypeId: '1',
      });
      expect(addActionToQueue).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Created);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAction);
    });

    it('should handle missing action type', async () => {
      (getActionTypeById as jest.Mock).mockResolvedValue(null);
      mockRequest.body = { name: 'Test Action', actionTypeId: '1' };

      await createActionWithPersistance(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch action type',
      });
    });
  });

  describe('deletePersistedAction', () => {
    it('should delete an action and remove it from the queue', async () => {
      (deleteAction as jest.Mock).mockResolvedValue(true);
      (deleteActionFromQueue as jest.Mock).mockResolvedValue(true);
      mockRequest.body = { id: '1' };

      await deletePersistedAction(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(deleteAction).toHaveBeenCalledWith('1');
      expect(deleteActionFromQueue).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
      expect(mockResponse.json).toHaveBeenCalledWith({
        deleteActionResult: true,
      });
    });

    it('should return 404 if deletion fails', async () => {
      (deleteAction as jest.Mock).mockResolvedValue(null);
      (deleteActionFromQueue as jest.Mock).mockResolvedValue(null);
      mockRequest.body = { id: '1' };

      await deletePersistedAction(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(
        HttpStatusCode.NotFound
      );
    });
  });

  describe('getActionFromDb', () => {
    it('should fetch an action by ID', async () => {
      const mockAction = { id: '1', name: 'Test Action' };
      (getActionById as jest.Mock).mockResolvedValue(mockAction);
      mockRequest.params = { id: '1' };

      await getActionFromDb(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getActionById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
      expect(mockResponse.send).toHaveBeenCalledWith(mockAction);
    });

    it('should return 404 if action is not found', async () => {
      (getActionById as jest.Mock).mockResolvedValue(null);
      mockRequest.params = { id: '1' };

      await getActionFromDb(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
