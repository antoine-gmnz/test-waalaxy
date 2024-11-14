import { Request } from 'express';
import { z } from 'zod';
import {
  CreateActionSchema,
  DeleteActionSchema,
} from '../schemas/actionSchema';

export type TypedRequest<T> = Request & { body: T };
export type RequestWithParams<T = undefined> = Request & {
  params: { [key: string]: string };
  body: T | undefined;
};

// Action
export type CreateActionRequestType = z.infer<typeof CreateActionSchema>;
export type DeleteActionRequestType = z.infer<typeof DeleteActionSchema>;

/**
 * TypedRequest is used to inject the right type for req.body based on a Zod schema.
 * Can also be done using trpc but not needed for the size of this backend.
 */
