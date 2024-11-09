import { Request } from 'express';
import { z } from 'zod';
import {
  CreateActionSchema,
  DeleteActionSchema,
} from '../schemas/actionSchema';

export type TypedRequest<T> = Request & { body: T };

export type CreateActionRequestType = z.infer<typeof CreateActionSchema>;
export type DeleteActionRequestType = z.infer<typeof DeleteActionSchema>;
