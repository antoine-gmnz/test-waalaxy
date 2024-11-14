import { recalculateCredits } from '../../processes/credit.process';
import {
  getAllActionTypes,
  updateActionTypeCredits,
} from '../../service/actionType.service';
import { calculateCreditsForActionType } from '../../utils/calculateCredits';

// Mock the imported dependencies
jest.mock('../../service/actionType.service', () => ({
  getAllActionTypes: jest.fn(),
  updateActionTypeCredits: jest.fn(),
}));

jest.mock('../../utils/calculateCredits', () => ({
  calculateCreditsForActionType: jest.fn(),
}));

describe('recalculateCredits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should recalculate and update credits for each action type', async () => {
    // Mock data
    const actionTypes = [
      { id: '1', name: 'ActionType1', maxCredits: 100, credits: 80 },
      { id: '2', name: 'ActionType2', maxCredits: 200, credits: 150 },
    ];

    // Set up mocks
    (getAllActionTypes as jest.Mock).mockResolvedValue(actionTypes);
    (calculateCreditsForActionType as jest.Mock).mockImplementation(
      (maxCredits: number) => maxCredits * 0.9
    ); // Example calculation

    // Call the function
    await recalculateCredits();

    // Verify getAllActionTypes was called
    expect(getAllActionTypes).toHaveBeenCalled();

    // Verify calculateCreditsForActionType was called with each maxCredits
    expect(calculateCreditsForActionType).toHaveBeenCalledWith(100);
    expect(calculateCreditsForActionType).toHaveBeenCalledWith(200);

    // Verify updateActionTypeCredits was called with correct values
    expect(updateActionTypeCredits).toHaveBeenCalledWith('1', 90); // 100 * 0.9
    expect(updateActionTypeCredits).toHaveBeenCalledWith('2', 180); // 200 * 0.9
  });

  it('should not call updateActionTypeCredits if there are no action types', async () => {
    // Mock empty response
    (getAllActionTypes as jest.Mock).mockResolvedValue([]);

    // Call the function
    await recalculateCredits();

    // Verify getAllActionTypes was called
    expect(getAllActionTypes).toHaveBeenCalled();

    // Verify that updateActionTypeCredits was not called
    expect(updateActionTypeCredits).not.toHaveBeenCalled();
  });
});
