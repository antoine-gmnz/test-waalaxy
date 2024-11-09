import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import { AppError } from '../utils/appError';
import { createAction, deleteAction } from '../service/action.service';
import { CreateActionRequestType, TypedRequest } from '../typings';
import { getBaseActionByName } from '../service/baseAction.service';
import { calculateCreditsForAction } from '../utils/calculateCredits';
import { CreateActionObjectType } from '../typings/action';
import { addActionToQueue } from '../service/queue.service';

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

    res.json({ ...createdActionResult });
  } catch (e: unknown) {
    res.sendStatus(HttpStatusCode.InternalServerError);
    throw new AppError(
      'API Error',
      HttpStatusCode.InternalServerError,
      e as string
    );
  }
};

const deletePersistedAction = async (req: Request, res: Response) => {
  try {
    const result = await deleteAction(req.body);

    if (!result) {
      throw new AppError(
        'API Error',
        HttpStatusCode.NotFound,
        `Action with id ${req.body.data.id} not found`
      );
    }

    res.json({ result });
  } catch (e: unknown) {
    res.sendStatus(500).send(e);
  }
};

export { createActionWithPersistance, deletePersistedAction };
