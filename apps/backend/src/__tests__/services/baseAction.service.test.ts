import prisma from '../../db/db';
import {
  getBaseActionByName,
  getAllBaseAction,
} from '../../service/baseAction.service';

jest.mock('../../db/db', () => ({
  baseAction: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('Action Service - Base Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBaseActionByName service test', () => {
    it('should return the base action with maxCredits and id when found', async () => {
      const mockResult = { maxCredits: 100, id: 'someBaseActionId' };
      (prisma.baseAction.findFirst as jest.Mock).mockResolvedValue(mockResult);

      const result = await getBaseActionByName('Amazing base action');

      expect(prisma.baseAction.findFirst).toHaveBeenCalledWith({
        select: { maxCredits: true, id: true },
        where: { name: 'Amazing base action' },
      });
      expect(result).toEqual(mockResult);
    });

    it('should return null if no base action is found', async () => {
      (prisma.baseAction.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getBaseActionByName('something false');

      expect(prisma.baseAction.findFirst).toHaveBeenCalledWith({
        select: { maxCredits: true, id: true },
        where: { name: 'something false' },
      });
      expect(result).toBeNull();
    });
  });

  describe('getAllBaseAction service test', () => {
    it('should return a list of all base actions', async () => {
      const mockResults = [
        { id: 'id1', name: 'A', maxCredits: 100 },
        { id: 'id2', name: 'B', maxCredits: 200 },
      ];
      (prisma.baseAction.findMany as jest.Mock).mockResolvedValue(mockResults);

      const result = await getAllBaseAction();

      expect(prisma.baseAction.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(mockResults);
    });

    it('should return an empty array if no base actions are found', async () => {
      (prisma.baseAction.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getAllBaseAction();

      expect(prisma.baseAction.findMany).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });
  });
});
