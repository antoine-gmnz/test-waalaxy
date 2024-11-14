import { Action } from '@prisma/client';

export type CreateActionObjectType = Pick<Action, 'actionTypeId' | 'name'>;
