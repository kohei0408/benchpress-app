export const PLATE_WEIGHTS = [25, 20, 15, 10, 5, 2.5, 1.25] as const;

export function calculatePlates(totalWeight: number, barWeight: number): number[] {
  const sideWeight = Math.max(0, (totalWeight - barWeight) / 2);
  const plates: number[] = [];
  let remaining = Math.round(sideWeight * 100) / 100;

  for (const plate of PLATE_WEIGHTS) {
    while (remaining + 0.001 >= plate) {
      plates.push(plate);
      remaining = Math.round((remaining - plate) * 100) / 100;
    }
  }

  return plates;
}
