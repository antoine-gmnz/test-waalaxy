import { HttpStatusCode } from 'axios';
import { Response, Request } from 'express';

import { getAllActionTypes } from '../service/actionType.service';

const getActionTypes = async (req: Request, res: Response) => {
  try {
    res.status(HttpStatusCode.Ok).send(await getAllActionTypes());
  } catch (error) {
    res.status(HttpStatusCode.InternalServerError).send(error);
  }
};

export { getActionTypes };
