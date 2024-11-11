import { PrismaClient } from '@prisma/client';
import { calculateCreditsForAction } from '../utils/calculateCredits';

const prisma = new PrismaClient();

// We export this function only for test purposes
export async function recalculateCredits() {
  const actionsToRecalculate = await prisma.action.findMany({
    where: {
      updatedAt: {
        lte: new Date(new Date().getTime() - 10 * 60 * 1000),
      },
    },
  });

  if (actionsToRecalculate.length > 0) {
    for (const action of actionsToRecalculate) {
      const newCredits = calculateCreditsForAction(action.maxCredits);

      await prisma.action.update({
        where: { id: action.id },
        data: {
          credits: newCredits,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  }
}

// Run the recalculation every 10 minutes
export default function startCreditRecalculation() {
  setInterval(recalculateCredits, 10 * 60 * 1000); // Run every 10 minutes
}
