import { PrismaClient } from '@prisma/client';
import { calculateCreditsForAction } from '../utils/calculateCredits';

const prisma = new PrismaClient();

async function recalculateCredits() {
  const actionsToRecalculate = await prisma.action.findMany({
    where: {
      updatedAt: {
        lte: new Date(new Date().getTime() - 10 * 60 * 1000),
      },
    },
  });

  if (actionsToRecalculate.length > 0) {
    console.log(
      `Found ${actionsToRecalculate.length} actions to recalculate credits`
    );

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
  } else {
    console.log('No actions need recalculating at this time');
  }
}

// Run the recalculation every 10 minutes
export default function startCreditRecalculation() {
  setInterval(recalculateCredits, 10 * 60 * 1000); // Run every 10 minutes
}
