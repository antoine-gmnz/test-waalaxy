import {
  getAllActionTypes,
  updateActionTypeCredits,
} from '../service/actionType.service';
import { calculateCreditsForActionType } from '../utils/calculateCredits';

// We export this function only for test purposes
export async function recalculateCredits() {
  const actionTypes = await getAllActionTypes();

  if (actionTypes.length > 0) {
    for (const actionType of actionTypes) {
      const newCredits = calculateCreditsForActionType(actionType.maxCredits);
      await updateActionTypeCredits(actionType.id, newCredits);
      console.log(
        `Credits for action ${actionType.name}, updated from ${actionType.credits} to ${newCredits}`
      );
    }
  }
}

// Run the recalculation every 10 minutes
export default function startCreditRecalculation() {
  setInterval(recalculateCredits, 10 * 60 * 1000); // Run every 10 minutes
}
