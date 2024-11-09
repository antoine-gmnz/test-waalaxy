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
      res.send('Internal server error');
    }

    res.status(200).json({ ...result });
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatusCode.InternalServerError).send(e);
  }
};

export { updateCreditForBaseAction };
