import { AppError } from '../utils/appError';
import prisma from '../db/db';
import { HttpStatusCode } from 'axios';
import { Credit } from '@prisma/client';

const updateCreditForAction = async (
  newCreditNumber: number,
  creditId: string
): Promise<Credit> => {
  const creditItem = await prisma.credit.findUnique({
    where: {
      id: creditId,
    },
  });

  if (!creditItem) {
    throw new AppError(
      'Credit item not found',
      HttpStatusCode.NotFound,
      `Credit with id ${creditId} not found.`
    );
  }

  const result = await prisma.credit.update({
    where: {
      id: creditId,
    },
    data: {
      creditNumber: newCreditNumber,
    },
  });

  return result;
};

export { updateCreditForAction };
