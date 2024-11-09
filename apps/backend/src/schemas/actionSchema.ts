import { z } from 'zod';

export const CreateActionSchema = z.object({
  name: z.string(),
});

export const DeleteActionSchema = z.object({
  id: z.string(),
});
