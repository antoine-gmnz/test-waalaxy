import express, { Response } from 'express';

import { updateCreditForBaseAction } from '../controller/credit.controller';
import { validateData } from '../middleware/validationMiddleware';
import { UpdateCreditSchema } from '../schemas/creditSchema';
import { TypedRequest, UpdateCreditRequestType } from '../typings';

const creditRouter = express.Router();

creditRouter.patch(
  '/:id',
  validateData(UpdateCreditSchema),
  (req: TypedRequest<UpdateCreditRequestType>, res: Response) =>
    updateCreditForBaseAction(req, res)
);

export default creditRouter;
