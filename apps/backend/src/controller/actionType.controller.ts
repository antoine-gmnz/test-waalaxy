import { HttpStatusCode } from 'axios';
import { Response, Request, NextFunction } from 'express';

import { getAllActionTypes } from '../service/actionType.service';

const getActionTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(HttpStatusCode.Ok).send(await getAllActionTypes());
  } catch (error) {
    next(error);
  }
};

export { getActionTypes };
