import { useMemo } from "react";
import { totalVolume } from "@/constants/formulas";
import type { FatigueLog, SuccessScoreResult, WorkoutSession } from "@/types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function recentAverageRpe(sessions: WorkoutSession[]) {
  const rpes = sessions
    .slice(0, 3)
    .flatMap((session) => session.sets.map((set) => set.rpe))
    .filter((rpe): rpe is number => typeof rpe === "number");
  if (rpes.length === 0) {
    return null;
  }
  return rpes.reduce((sum, rpe) => sum + rpe, 0) / rpes.length;
}

export function useSuccessScore(
  sessions: WorkoutSession[],
  fatigue: FatigueLog,
  stagnationWeeks: number,
  targetWeight: number,
): SuccessScoreResult {
  return useMemo(() => {
    const latest = sessions[0];
    const latestOneRm = latest?.estimated1RM ?? 0;
    const targetRatio = targetWeight > 0 && latestOneRm > 0 ? latestOneRm / targetWeight : 0.72;
    const strengthBase = 35 + Math.min(35, targetRatio * 35);

    let trendImpact = 0;
    if (sessions.length >= 2) {
      const newest = sessions[0].estimated1RM;
      const previous = sessions[Math.min(3, sessions.length - 1)].estimated1RM;
      const trendRate = previous > 0 ? (newest - previous) / previous : 0;
      trendImpact = Math.max(-12, Math.min(14, trendRate * 180));
    }

    let volumeImpact = 0;
    if (sessions.length >= 4) {
      const recentVolume = sessions.slice(0, 2).reduce((sum, session) => sum + totalVolume(session.sets), 0);
      const previousVolume = sessions.slice(2, 4).reduce((sum, session) => sum + totalVolume(session.sets), 0);
      const volumeRate = previousVolume > 0 ? (recentVolume - previousVolume) / previousVolume : 0;
      volumeImpact = Math.max(-8, Math.min(8, volumeRate * 22));
    } else if (sessions.length >= 2) {
      const diff = totalVolume(sessions[0].sets) - totalVolume(sessions[1].sets);
      volumeImpact = diff >= 0 ? 4 : -4;
    }

    const sleepImpact =
      fatigue.sleepHours >= 8
        ? 8
        : fatigue.sleepHours >= 7
          ? 5
          : fatigue.sleepHours >= 6
            ? -3
            : -10;
    const fatigueImpact = 12 - fatigue.fatigueScore * 0.32;
    const stagnationImpact = -Math.min(14, stagnationWeeks * 6);
    const avgRpe = recentAverageRpe(sessions);
    const rpeImpact = avgRpe === null ? 0 : avgRpe >= 9 ? -8 : avgRpe >= 8 ? -3 : avgRpe <= 7 ? 4 : 0;

    const factors = [
      { label: "推定1RM", impact: Math.round(strengthBase - 50) },
      { label: "直近の記録", impact: Math.round(trendImpact) },
      { label: "ボリューム", impact: Math.round(volumeImpact) },
      { label: "疲労度", impact: Math.round(fatigueImpact) },
      { label: "睡眠時間", impact: Math.round(sleepImpact) },
      { label: "RPE", impact: Math.round(rpeImpact) },
      { label: "停滞", impact: Math.round(stagnationImpact) },
    ];
    const score =
      strengthBase +
      trendImpact +
      volumeImpact +
      sleepImpact +
      fatigueImpact +
      stagnationImpact +
      rpeImpact;

    return { score: clampScore(score), factors };
  }, [fatigue, sessions, stagnationWeeks, targetWeight]);
}
