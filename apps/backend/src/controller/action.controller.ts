import { Response } from 'express';
import { HttpStatusCode } from 'axios';

import { AppError } from '../utils/appError';
import {
  createAction,
  deleteAction,
  getActionById,
} from '../service/action.service';
import {
  CreateActionRequestType,
  DeleteActionRequestType,
  RequestWithParams,
  TypedRequest,
} from '../typings';
import { getBaseActionByName } from '../service/baseAction.service';
import { calculateCreditsForAction } from '../utils/calculateCredits';
import { CreateActionObjectType } from '../typings/action';
import {
  addActionToQueue,
  deleteActionFromQueue,
} from '../service/queue.service';

const createActionWithPersistance = async (
  req: TypedRequest<CreateActionRequestType>,
  res: Response
) => {
  try {
    const baseAction = await getBaseActionByName(req.body.name);
    if (!baseAction) {
      return res.status(HttpStatusCode.NotFound).json({
        error: 'Failed to fetch base action',
      });
    }

    const createActionData: CreateActionObjectType = {
      name: req.body.name,
      maxCredits: baseAction.maxCredits,
      credits: calculateCreditsForAction(baseAction.maxCredits),
      updatedAt: new Date(),
      baseActionId: baseAction.id,
    };

    const createdActionResult = await createAction(createActionData);
    if (!createdActionResult) {
      return res.status(HttpStatusCode.InternalServerError).json({
        error: 'Failed to create action',
      });
    }

    // Finally add the created action to the global queue
    await addActionToQueue(createdActionResult.id);

    res.status(HttpStatusCode.Created).json({ ...createdActionResult });
  } catch (e: unknown) {
    res.status(HttpStatusCode.InternalServerError).send(e);
    throw new AppError(
      'API Error',
      HttpStatusCode.InternalServerError,
      e as string
    );
  }
};

const deletePersistedAction = async (
  req: TypedRequest<DeleteActionRequestType>,
  res: Response
) => {
  try {
    const { id }: DeleteActionRequestType = req.body;

    const deleteActionResult = await deleteAction(id);
    const deleteActionFromQueueResult = await deleteActionFromQueue(id);

    if (!deleteActionResult || !deleteActionFromQueueResult) {
      res.sendStatus(HttpStatusCode.NotFound);
    }

    res.status(HttpStatusCode.Ok).json({ deleteActionResult });
  } catch (e: unknown) {
    res.status(HttpStatusCode.InternalServerError).send(e);
  }
};

const getActionFromDb = async (req: RequestWithParams, res: Response) => {
  try {
    console.log(req.params.id);
    const result = await getActionById(req.params.id);

    if (!result) {
      res.status(HttpStatusCode.NotFound).send();
    }

    res.status(HttpStatusCode.Ok).send(result);
  } catch (error) {
    res.status(HttpStatusCode.InternalServerError);
  }
};

export { createActionWithPersistance, deletePersistedAction, getActionFromDb };
