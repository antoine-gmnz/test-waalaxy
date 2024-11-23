import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response, Request, NextFunction } from 'express';

import { logger } from '../utils/logger';
import { HttpStatusCode } from 'axios';
import { convertPrismaCodeToHttp } from '../utils/convertPrismaCodeToHttp';

export const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof PrismaClientKnownRequestError) {
    const error = convertPrismaCodeToHttp(err.code);
    logger.error(error.message);
    res
      .status(error.httpStatus)
      .send({ endpoint: req.url, message: error.message, data: err.message });
  } else {
    logger.error(err);
    res.status(HttpStatusCode.InternalServerError).send(err);
  }
  next();
};
