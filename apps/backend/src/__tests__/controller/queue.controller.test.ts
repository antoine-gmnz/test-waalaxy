import { getQueue } from '../../controller/queue.controller';
import { upsertQueue } from '../../service/queue.service';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

jest.mock('../../service/queue.service');

describe('Queue Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should return 404 if no queue is found', async () => {
    (upsertQueue as jest.Mock).mockResolvedValue(null);

    await getQueue(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    expect(res.send).toHaveBeenCalledWith('No queue found, try again later');
  });

  it('should return 200 with the queue data if found', async () => {
    const queueData = { id: '123', actionIds: ['456', '789'] };
    (upsertQueue as jest.Mock).mockResolvedValue(queueData);

    await getQueue(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(res.send).toHaveBeenCalledWith(queueData);
  });

  it('should return 500 if an error occurs', async () => {
    (upsertQueue as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getQueue(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(res.send).toHaveBeenCalledWith(expect.any(Error));
  });
});
