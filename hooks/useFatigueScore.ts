import { useMemo } from "react";
import type { MuscleGroup } from "@/types";

export function useFatigueScore(sleepHours: number, soreMuscles: MuscleGroup[]) {
  return useMemo(() => {
    const sleepImpact = sleepHours >= 7 ? -10 : Math.min(35, (7 - sleepHours) * 10);
    const muscleImpact = soreMuscles.length * 12;
    return Math.min(100, Math.max(0, Math.round(25 + sleepImpact + muscleImpact)));
  }, [sleepHours, soreMuscles]);
}
