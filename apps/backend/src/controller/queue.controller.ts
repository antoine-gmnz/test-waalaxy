import { HttpStatusCode } from 'axios';
import { Response, Request, NextFunction } from 'express';

import { upsertQueue } from '../service/queue.service';

const getQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await upsertQueue();
    if (!response) {
      res
        .status(HttpStatusCode.NotFound)
        .send('No queue found, try again later');
    }

    res.status(HttpStatusCode.Ok).send(response);
  } catch (e) {
    next(e);
  }
};

export { getQueue };
