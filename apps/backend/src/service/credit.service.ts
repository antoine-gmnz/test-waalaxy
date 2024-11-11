import prisma from '../db/db';
import { Credit } from '@prisma/client';

const updateCreditForAction = async (
  newCreditNumber: number,
  creditId: string
): Promise<Credit | null> => {
  const creditItem = await prisma.credit.findUnique({
    where: {
      id: creditId,
    },
  });

  if (!creditItem) return null;

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
