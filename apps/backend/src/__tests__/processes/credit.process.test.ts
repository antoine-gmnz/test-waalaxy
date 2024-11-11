import { PrismaClient } from '@prisma/client';
import { recalculateCredits } from '../../processes/credit.process';
import { calculateCreditsForAction } from '../../utils/calculateCredits';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    action: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock('../../utils/calculateCredits', () => ({
  calculateCreditsForAction: jest.fn(),
}));

const prisma = new PrismaClient();

describe('recalculateCredits', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should recalculate credits for actions that need updating', async () => {
    const mockActions = [
      {
        id: 'action1',
        maxCredits: 100,
        updatedAt: new Date(new Date().getTime() - 11 * 60 * 1000),
      },
      {
        id: 'action2',
        maxCredits: 80,
        updatedAt: new Date(new Date().getTime() - 12 * 60 * 1000),
      },
    ];

    (prisma.action.findMany as jest.Mock).mockResolvedValue(mockActions);
    (calculateCreditsForAction as jest.Mock).mockReturnValue(50);

    await recalculateCredits();

    expect(prisma.action.findMany).toHaveBeenCalledWith({
      where: {
        updatedAt: {
          lte: expect.any(Date),
        },
      },
    });

    for (const action of mockActions) {
      expect(calculateCreditsForAction).toHaveBeenCalledWith(action.maxCredits);
      expect(prisma.action.update).toHaveBeenCalledWith({
        where: { id: action.id },
        data: {
          credits: 50, // based on mock return value
          updatedAt: expect.any(String),
        },
      });
    }
  });

  it('should not update any actions if none need recalculating', async () => {
    (prisma.action.findMany as jest.Mock).mockResolvedValue([]);

    await recalculateCredits();

    expect(prisma.action.findMany).toHaveBeenCalled();
    expect(prisma.action.update).not.toHaveBeenCalled();
  });
});
