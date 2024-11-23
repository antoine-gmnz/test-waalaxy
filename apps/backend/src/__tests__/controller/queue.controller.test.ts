import { getQueue } from '../../controller/queue.controller';
import { upsertQueue } from '../../service/queue.service';
import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';

jest.mock('../../service/queue.service');

describe('getQueue Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => jest.resetAllMocks());

  it('should return the queue with status 200 if upsertQueue returns a valid response', async () => {
    const mockQueue = { id: '1', name: 'Test Queue' };
    (upsertQueue as jest.Mock).mockResolvedValue(mockQueue);

    await getQueue(mockRequest as Request, mockResponse as Response, mockNext);

    expect(upsertQueue).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(mockResponse.send).toHaveBeenCalledWith(mockQueue);
  });

  it('should return 404 if upsertQueue returns null or undefined', async () => {
    (upsertQueue as jest.Mock).mockResolvedValue(null);

    await getQueue(mockRequest as Request, mockResponse as Response, mockNext);

    expect(upsertQueue).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    expect(mockResponse.send).toHaveBeenCalledWith(
      'No queue found, try again later'
    );
  });

  it('should call next with an error if upsertQueue throws an error', async () => {
    const mockError = new Error('Service error');
    (upsertQueue as jest.Mock).mockRejectedValue(mockError);

    await getQueue(mockRequest as Request, mockResponse as Response, mockNext);

    expect(upsertQueue).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
