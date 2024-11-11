import { Action } from '@prisma/client';
import prisma from '../db/db';
import { CreateActionObjectType } from '../typings/action';

const createAction = async (
  action: CreateActionObjectType
): Promise<Action | null> => {
  const result = await prisma.action.create({
    data: { ...action },
  });

  if (result) return result;

  return null;
};

const deleteAction = async (id: string) => {
  const result = await prisma.action.delete({
    where: { id },
  });
  if (result) return true;

  return false;
};

const getActionById = async (id: string) => {
  return await prisma.action.findFirst({
    where: {
      id,
    },
  });
};

export { createAction, deleteAction, getActionById };
