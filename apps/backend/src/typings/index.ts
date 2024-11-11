import { Request } from 'express';
import { z } from 'zod';
import {
  CreateActionSchema,
  DeleteActionSchema,
} from '../schemas/actionSchema';
import { UpdateCreditSchema } from '../schemas/creditSchema';

export type TypedRequest<T> = Request & { body: T };
export type RequestWithParams = Request & { params: { [key: string]: string } };

// Action
export type CreateActionRequestType = z.infer<typeof CreateActionSchema>;
export type DeleteActionRequestType = z.infer<typeof DeleteActionSchema>;

// Credits
export type UpdateCreditRequestType = z.infer<typeof UpdateCreditSchema>;

/**
 * TypedRequest is used to inject the right type for req.body based on a Zod schema.
 * Can also be done using trpc but not needed for the size of this backend.
 */
