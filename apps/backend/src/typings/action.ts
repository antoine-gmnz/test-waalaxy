import { Action } from '@prisma/client';

export type CreateActionObjectType = Omit<Action, 'id' | 'createdAt'>;
