import { HttpStatusCode } from 'axios';
import { Response, Request } from 'express';

import { getQueueDetails } from '../service/queue.service';

const getQueue = async (req: Request, res: Response) => {
  try {
    const response = await getQueueDetails();
    if (!response) {
      res
        .status(HttpStatusCode.NotFound)
        .send('No queue found, try again later');
    }

    res.status(HttpStatusCode.Ok).send(response);
  } catch (e) {
    res.status(HttpStatusCode.InternalServerError).send(e);
  }
};

export { getQueue };
