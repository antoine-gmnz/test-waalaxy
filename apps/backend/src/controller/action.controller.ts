import { Response } from 'express';
import { HttpStatusCode } from 'axios';

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
import { CreateActionObjectType } from '../typings/action';
import {
  addActionToQueue,
  deleteActionFromQueue,
} from '../service/queue.service';
import { getActionTypeById } from '../service/actionType.service';

const createActionWithPersistance = async (
  req: TypedRequest<CreateActionRequestType>,
  res: Response
) => {
  try {
    const actionType = await getActionTypeById(req.body.actionTypeId);
    if (!actionType) {
      return res.status(HttpStatusCode.NotFound).json({
        error: 'Failed to fetch action type',
      });
    }

    const createActionData: CreateActionObjectType = {
      actionTypeId: req.body.actionTypeId,
      name: req.body.name,
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
    req.log.error(e);
    res.status(HttpStatusCode.InternalServerError).send(e);
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
    req.log.error(e);
    res.status(HttpStatusCode.InternalServerError).send(e);
  }
};

const getActionFromDb = async (req: RequestWithParams, res: Response) => {
  try {
    const result = await getActionById(req.params.id);

    if (!result) {
      res.status(HttpStatusCode.NotFound).send();
    }

    res.status(HttpStatusCode.Ok).send(result);
  } catch (e) {
    req.log.error(e);
    res.status(HttpStatusCode.InternalServerError).send(e);
  }
};

export { createActionWithPersistance, deletePersistedAction, getActionFromDb };
