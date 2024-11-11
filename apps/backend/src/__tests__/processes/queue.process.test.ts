import { PrismaClient } from '@prisma/client';

import { processQueue } from '../../processes/queue.process';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    action: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    queue: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    credit: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const mockPrisma = new PrismaClient();

describe('Queue Processor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process queue and remove action if credits are sufficient', async () => {
    const queueItem = { id: 'queueId', actionIds: ['actionId'] };
    const action = {
      id: 'actionId',
      baseActionId: 'baseActionId',
      credits: 50,
    };
    const creditItem = {
      id: 'creditId',
      creditNumber: 100,
      baseActionId: 'baseActionId',
    };

    // Mock implementations for Prisma methods
    (mockPrisma.queue.findFirst as jest.Mock).mockResolvedValue(queueItem);
    (mockPrisma.action.findUnique as jest.Mock).mockResolvedValue(action);
    (mockPrisma.credit.findFirst as jest.Mock).mockResolvedValue(creditItem);
    (mockPrisma.credit.update as jest.Mock).mockResolvedValue({
      ...creditItem,
      creditNumber: 50,
    });
    (mockPrisma.queue.update as jest.Mock).mockResolvedValue({
      ...queueItem,
      actionIds: [],
    });
    (mockPrisma.action.delete as jest.Mock).mockResolvedValue(action);

    await processQueue();

    expect(mockPrisma.queue.findFirst).toHaveBeenCalled();
    expect(mockPrisma.action.findUnique).toHaveBeenCalledWith({
      where: { id: 'actionId' },
    });
    expect(mockPrisma.credit.findFirst).toHaveBeenCalledWith({
      where: { baseActionId: 'baseActionId' },
    });
    expect(mockPrisma.credit.update).toHaveBeenCalled();
    expect(mockPrisma.queue.update).toHaveBeenCalledWith({
      where: { id: 'queueId' },
      data: { actionIds: [] },
    });
    expect(mockPrisma.action.delete).toHaveBeenCalledWith({
      where: { id: 'actionId' },
    });
  });
});
