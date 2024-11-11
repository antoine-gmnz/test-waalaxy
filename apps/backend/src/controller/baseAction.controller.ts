import { getAllBaseAction } from '../service/baseAction.service';
import { TypedRequest } from '../typings';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';

const getAllBaseActionController = async (
  req: TypedRequest<undefined>,
  res: Response
) => {
  try {
    const result = await getAllBaseAction();

    res.status(HttpStatusCode.Ok).send(result);
  } catch (e) {
    res.status(HttpStatusCode.InternalServerError).send(e);
  }
};

export { getAllBaseActionController };
