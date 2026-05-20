import { useMemo } from "react";
import { totalVolume } from "@/constants/formulas";
import type { WorkoutSession } from "@/types";

export function useStagnationDetect(sessions: WorkoutSession[]) {
  return useMemo(() => {
    const ordered = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
    if (ordered.length < 3) {
      return { isStagnating: false, weeks: 0, message: "" };
    }

    const recent = ordered.slice(0, 3);
    const maxOneRm = Math.max(...recent.map((session) => session.estimated1RM));
    const latestOneRm = recent[0].estimated1RM;
    const recentVolume = totalVolume(recent[0].sets);
    const previousVolume = totalVolume(recent[1].sets);
    const isStagnating = latestOneRm <= maxOneRm && recentVolume <= previousVolume;

    return {
      isStagnating,
      weeks: isStagnating ? 2 : 0,
      message: isStagnating
        ? "2週間停滞しています。セット構成を変えて刺激を入れましょう。"
        : "",
    };
  }, [sessions]);
}
