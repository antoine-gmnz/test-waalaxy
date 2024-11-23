import { prismaErrorMapping } from './prismaErrorCodeMapping';

export const convertPrismaCodeToHttp = (
  code: string
): {
  message: string;
  httpStatus: number;
} => {
  const error = prismaErrorMapping.get(code);
  if (!error) {
    return {
      httpStatus: 500,
      message: 'Something went wrong',
    };
  }
  return error;
};
