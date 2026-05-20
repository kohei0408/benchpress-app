import type { OneRmFormula, SetRecord } from "@/types";

export function estimateOneRm(weight: number, reps: number, formula: OneRmFormula): number {
  if (reps <= 1) {
    return weight;
  }

  const value =
    formula === "epley"
      ? weight * (1 + reps / 30)
      : (weight * 36) / Math.max(1, 37 - reps);

  return Math.round(value * 10) / 10;
}

export function bestEstimatedOneRm(sets: SetRecord[], formula: OneRmFormula): number {
  return sets.reduce((best, set) => {
    const estimate = estimateOneRm(set.weight, set.reps, formula);
    return Math.max(best, estimate);
  }, 0);
}

export function totalVolume(sets: SetRecord[]): number {
  return sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
}
