import prisma from '../db/db';

export const getBaseActionByName = async (name: string) => {
  return await prisma.baseAction.findFirst({
    select: { maxCredits: true },
    where: {
      name,
    },
  });
};
