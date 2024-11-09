import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateData =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    req.body = validation.data as T;
    next();
  };
