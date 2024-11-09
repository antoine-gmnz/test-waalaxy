import { Request } from 'express';
import { z } from 'zod';
import {
  CreateActionSchema,
  DeleteActionSchema,
} from '../schemas/actionSchema';
import { UpdateCreditSchema } from '../schemas/creditSchema';

export type TypedRequest<T> = Request & { body: T };

// Action
export type CreateActionRequestType = z.infer<typeof CreateActionSchema>;
export type DeleteActionRequestType = z.infer<typeof DeleteActionSchema>;

// Credits
export type UpdateCreditRequestType = z.infer<typeof UpdateCreditSchema>;
