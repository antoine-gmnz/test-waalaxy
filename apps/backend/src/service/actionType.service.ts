import prisma from '../db/db';

const getAllActionTypes = async () => {
  return await prisma.actionType.findMany();
};

const updateActionTypeCredits = async (id: string, newCredits: number) => {
  return await prisma.actionType.update({
    where: { id },
    data: {
      credits: newCredits,
    },
  });
};

const getActionTypeById = async (id: string) => {
  return await prisma.actionType.findFirst({
    where: { id },
  });
};

export { getAllActionTypes, updateActionTypeCredits, getActionTypeById };
