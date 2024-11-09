import express, { Response } from 'express';

import {
  CreateActionSchema,
  DeleteActionSchema,
} from '../schemas/actionSchema';
import { validateData } from '../middleware/validationMiddleware';
import {
  createActionWithPersistance,
  deletePersistedAction,
} from '../controller/action.controller';
import {
  CreateActionRequestType,
  DeleteActionRequestType,
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
  (req: TypedRequest<CreateActionRequestType>, res: Response) =>
    createActionWithPersistance(req, res)
);
actionRouter.delete(
  ':id',
  validateData(DeleteActionSchema),
  (req: TypedRequest<DeleteActionRequestType>, res: Response) =>
    deletePersistedAction(req, res)
);

export default actionRouter;
