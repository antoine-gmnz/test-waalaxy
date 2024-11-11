import prisma from '../../db/db';
import { updateCreditForAction } from '../../service/credit.service';
import { Credit } from '@prisma/client';

jest.mock('../../db/db', () => ({
  credit: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe('updateCreditForAction', () => {
  const creditId = 'credit123';
  const newCreditNumber = 50;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the credit number and return the updated credit item', async () => {
    const mockCredit: Credit = {
      id: creditId,
      creditNumber: 20,
      baseActionId: 'my super id',
    };
    const updatedCredit: Credit = {
      ...mockCredit,
      creditNumber: newCreditNumber,
    };

    (prisma.credit.findUnique as jest.Mock).mockResolvedValue(mockCredit);
    (prisma.credit.update as jest.Mock).mockResolvedValue(updatedCredit);

    const result = await updateCreditForAction(newCreditNumber, creditId);

    expect(prisma.credit.findUnique).toHaveBeenCalledWith({
      where: { id: creditId },
    });
    expect(prisma.credit.update).toHaveBeenCalledWith({
      where: { id: creditId },
      data: { creditNumber: newCreditNumber },
    });
    expect(result).toEqual(updatedCredit);
  });

  it('should return null if the credit item is not found', async () => {
    (prisma.credit.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await updateCreditForAction(newCreditNumber, creditId);

    expect(prisma.credit.findUnique).toHaveBeenCalledWith({
      where: { id: creditId },
    });
    expect(prisma.credit.update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
