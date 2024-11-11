import prisma from '../db/db';

export const getBaseActionByName = async (name: string) => {
  return await prisma.baseAction.findFirst({
    select: { maxCredits: true, id: true },
    where: {
      name,
    },
  });
};

export const getAllBaseAction = async () => {
  return await prisma.baseAction.findMany();
};
