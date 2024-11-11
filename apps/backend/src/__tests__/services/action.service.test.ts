import prisma from '../../db/db';
import { createAction, deleteAction } from '../../service/action.service';
import { Action } from '@prisma/client';

jest.mock('../../db/db', () => ({
  action: {
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

const MOCK_ACTION = {
  name: 'Sample Action',
  maxCredits: 100,
  credits: 80,
  baseActionId: 'my super action id',
  updatedAt: new Date(),
};

describe('createAction service test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an action and return it when successful', async () => {
    const mockResult: Action = {
      ...MOCK_ACTION,
      id: 'someId',
      createdAt: new Date(),
    };
    (prisma.action.create as jest.Mock).mockResolvedValue(mockResult);

    const result = await createAction(MOCK_ACTION);

    expect(prisma.action.create).toHaveBeenCalledWith({
      data: { ...MOCK_ACTION },
    });
    expect(result).toEqual(mockResult);
  });

  it('should return null if the action creation fails', async () => {
    (prisma.action.create as jest.Mock).mockResolvedValue(null);

    const result = await createAction(MOCK_ACTION);

    expect(prisma.action.create).toHaveBeenCalledWith({
      data: { ...MOCK_ACTION },
    });
    expect(result).toBeNull();
  });
});

describe('deleteAction servuce test', () => {
  it('should delete an action and return true when successful', async () => {
    const mockDeleteResult: Action = {
      ...MOCK_ACTION,
      id: 'someId',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prisma.action.delete as jest.Mock).mockResolvedValue(mockDeleteResult);

    const result = await deleteAction('someId');

    expect(prisma.action.delete).toHaveBeenCalledWith({
      where: { id: 'someId' },
    });
    expect(result).toBe(true);
  });

  it('should return false if the action deletion fails', async () => {
    (prisma.action.delete as jest.Mock).mockResolvedValue(null);

    const result = await deleteAction('someId');

    expect(prisma.action.delete).toHaveBeenCalledWith({
      where: { id: 'someId' },
    });
    expect(result).toBe(false);
  });
});
