import { Response } from 'express';

import { updateCreditForAction } from '../service/credit.service';
import { TypedRequest, UpdateCreditRequestType } from '../typings';
import { HttpStatusCode } from 'axios';

const updateCreditForBaseAction = async (
  req: TypedRequest<UpdateCreditRequestType>,
  res: Response
) => {
  try {
    const { creditId, newCreditNumber }: UpdateCreditRequestType = req.body;

    const result = await updateCreditForAction(newCreditNumber, creditId);

    if (!result) {
      res.sendStatus(HttpStatusCode.InternalServerError);
    }

    res.status(HttpStatusCode.Ok).json({ ...result });
  } catch (e) {
    res.status(HttpStatusCode.InternalServerError).send(e);
  }
};

export { updateCreditForBaseAction };
