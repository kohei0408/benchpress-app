import { useMemo } from "react";
import { totalVolume } from "@/constants/formulas";
import type { FatigueLog, SuccessScoreResult, WorkoutSession } from "@/types";

const BASE_SCORE = 50;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function useSuccessScore(
  sessions: WorkoutSession[],
  fatigue: FatigueLog,
  stagnationWeeks: number,
): SuccessScoreResult {
  return useMemo(() => {
    if (sessions.length === 0) {
      return { score: BASE_SCORE, factors: [] };
    }

    const factors: SuccessScoreResult["factors"] = [];
    let delta = 0;

    const recentFour = sessions.slice(0, 4);
    let oneRmImpact = 0;
    if (recentFour.length >= 2) {
      const newest = recentFour[0].estimated1RM;
      const oldest = recentFour[recentFour.length - 1].estimated1RM;
      if (newest > oldest) {
        oneRmImpact = 20;
      } else if (newest < oldest) {
        oneRmImpact = -15;
      }
    }
    factors.push({ label: "1RM伸び率", impact: oneRmImpact });
    delta += oneRmImpact;

    let volumeImpact = 0;
    if (sessions.length >= 2) {
      const latestVolume = totalVolume(sessions[0].sets);
      const previousVolume = totalVolume(sessions[1].sets);
      if (latestVolume > previousVolume) {
        volumeImpact = 10;
      } else if (latestVolume < previousVolume) {
        volumeImpact = -10;
      }
    }
    factors.push({ label: "ボリューム", impact: volumeImpact });
    delta += volumeImpact;

    let fatigueImpact = 0;
    if (fatigue.fatigueScore <= 30) {
      fatigueImpact = 15;
    } else if (fatigue.fatigueScore >= 61) {
      fatigueImpact = -15;
    }
    factors.push({ label: "疲労", impact: fatigueImpact });
    delta += fatigueImpact;

    let sleepImpact = 0;
    if (fatigue.sleepHours >= 7) {
      sleepImpact = 10;
    } else if (fatigue.sleepHours < 5) {
      sleepImpact = -10;
    }
    factors.push({ label: "睡眠", impact: sleepImpact });
    delta += sleepImpact;

    let stagnationImpact = 0;
    if (stagnationWeeks >= 3) {
      stagnationImpact = -20;
    } else if (stagnationWeeks === 2) {
      stagnationImpact = -10;
    }
    factors.push({ label: "停滞", impact: stagnationImpact });
    delta += stagnationImpact;

    return { score: clampScore(BASE_SCORE + delta), factors };
  }, [fatigue, sessions, stagnationWeeks]);
}
