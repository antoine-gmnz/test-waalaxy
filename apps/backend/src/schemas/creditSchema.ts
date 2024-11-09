import { z } from 'zod';

export const UpdateCreditSchema = z.object({
  newCreditNumber: z.number(),
  creditId: z.string(),
});
