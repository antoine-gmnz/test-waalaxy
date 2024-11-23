import express, { NextFunction, Response } from 'express';

import {
  CreateActionSchema,
  DeleteActionSchema,
} from '../schemas/actionSchema';
import { validateData } from '../middleware/validationMiddleware';
import {
  createActionWithPersistance,
  deletePersistedAction,
  getActionFromDb,
} from '../controller/action.controller';
import {
  CreateActionRequestType,
  DeleteActionRequestType,
  RequestWithParams,
  TypedRequest,
} from '../typings';

const actionRouter = express.Router();

/**
 * (req: TypedRequest<CreateActionRequestType>, res: Response) is used to type req.body
 * using a zod schema.
 * Described in src/schemas
 */

actionRouter.post(
  '/',
  validateData(CreateActionSchema),
  (
    req: TypedRequest<CreateActionRequestType>,
    res: Response,
    next: NextFunction
  ) => createActionWithPersistance(req, res, next)
);
actionRouter.delete(
  '/:id',
  validateData(DeleteActionSchema),
  (
    req: TypedRequest<DeleteActionRequestType>,
    res: Response,
    next: NextFunction
  ) => deletePersistedAction(req, res, next)
);

actionRouter.get(
  '/:id',
  (req: RequestWithParams, res: Response, next: NextFunction) =>
    getActionFromDb(req, res, next)
);

export default actionRouter;
