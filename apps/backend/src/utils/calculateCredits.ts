export function calculateCreditsForAction(maxCredits: number): number {
  const minPercentage = 0.8;
  const maxPercentage = 1.0;

  const randomPercentage =
    Math.random() * (maxPercentage - minPercentage) + minPercentage;
  return Math.floor(maxCredits * randomPercentage);
}
