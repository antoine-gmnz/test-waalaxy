import { z } from 'zod';

export const CreateActionSchema = z.object({
  actionTypeId: z.string(),
  name: z.string(),
});

export const DeleteActionSchema = z.object({
  id: z.string(),
});
