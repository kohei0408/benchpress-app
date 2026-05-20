import { useCallback, useMemo, useState } from "react";
import type { AIRecommendation, FatigueLog, SetType, WorkoutSession } from "@/types";

interface UseAIRecommendationResult {
  recommendation: AIRecommendation;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

function fallbackRecommendation(sessions: WorkoutSession[], fatigue: FatigueLog): AIRecommendation {
  const latest = sessions[0];
  const latestWeight = latest?.sets[0]?.weight ?? 75;
  const setType: SetType = fatigue.fatigueScore > 65 ? "straight" : "topset-backoff";
  const weight = fatigue.fatigueScore > 65 ? latestWeight - 5 : latestWeight + 2.5;
  return {
    setType,
    sets: [
      { weight, reps: fatigue.fatigueScore > 65 ? 5 : 3 },
      { weight: Math.max(20, weight - 5), reps: 6 },
      { weight: Math.max(20, weight - 5), reps: 6 },
    ],
    challengeWeight: fatigue.fatigueScore > 45 ? undefined : weight + 5,
    comment:
      fatigue.sleepHours < 6
        ? "睡眠が短めです。今日はフォーム優先で成功率を守りましょう。"
        : `${weight} kgを軸に、成功率を保ちながら次の更新を狙えます。`,
  };
}

export function useAIRecommendation(
  sessions: WorkoutSession[],
  fatigue: FatigueLog,
): UseAIRecommendationResult {
  const initial = useMemo(() => fallbackRecommendation(sessions, fatigue), [fatigue, sessions]);
  const [recommendation, setRecommendation] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    const endpoint = process.env.EXPO_PUBLIC_AI_RECOMMENDATION_URL;
    if (!endpoint) {
      setRecommendation(fallbackRecommendation(sessions, fatigue));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "あなたはベンチプレス専門のAIコーチです。安全性と更新確率を重視してください。",
          sessions: sessions.slice(0, 5),
          fatigue,
        }),
      });
      if (!response.ok) {
        setRecommendation(fallbackRecommendation(sessions, fatigue));
        return;
      }
      const payload = (await response.json()) as AIRecommendation;
      setRecommendation(payload);
    } catch {
      setRecommendation(fallbackRecommendation(sessions, fatigue));
    } finally {
      setIsLoading(false);
    }
  }, [fatigue, sessions]);

  return { recommendation, isLoading, refresh };
}
