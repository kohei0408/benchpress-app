import { useMemo } from "react";
import { totalVolume } from "@/constants/formulas";
import type { FatigueLog, SuccessScoreResult, WorkoutSession } from "@/types";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function useSuccessScore(
  sessions: WorkoutSession[],
  fatigue: FatigueLog,
  stagnationWeeks: number,
): SuccessScoreResult {
  return useMemo(() => {
    const ordered = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
    const first = ordered[0]?.estimated1RM ?? 0;
    const latest = ordered[ordered.length - 1]?.estimated1RM ?? first;
    const growthRate = first > 0 ? (latest - first) / first : 0;
    const oneRmImpact = growthRate > 0.03 ? 30 : growthRate > 0 ? 18 : -20;

    const recentVolume = ordered.slice(-2).reduce((sum, session) => sum + totalVolume(session.sets), 0);
    const previousVolume = ordered
      .slice(Math.max(0, ordered.length - 4), Math.max(0, ordered.length - 2))
      .reduce((sum, session) => sum + totalVolume(session.sets), 0);
    const volumeImpact = recentVolume >= previousVolume ? 20 : -8;
    const fatigueImpact = fatigue.fatigueScore <= 35 ? 25 : fatigue.fatigueScore >= 70 ? -25 : 8;
    const sleepImpact = fatigue.sleepHours >= 7 ? 15 : -12;
    const stagnationImpact = stagnationWeeks === 0 ? 10 : -Math.min(20, stagnationWeeks * 10);

    const factors = [
      { label: "1RM推移", impact: oneRmImpact },
      { label: "週間ボリューム", impact: volumeImpact },
      { label: "疲労", impact: fatigueImpact },
      { label: "睡眠", impact: sleepImpact },
      { label: "停滞", impact: stagnationImpact },
    ];
    const raw = 50 + factors.reduce((sum, item) => sum + item.impact, 0) / 2;

    return { score: clamp(raw), factors };
  }, [fatigue, sessions, stagnationWeeks]);
}
