import type { SetRecord, SetType } from "@/types";

export const SET_TYPE_LABELS: Record<SetType, string> = {
  straight: "ストレート",
  pyramid: "ピラミッド",
  "reverse-pyramid": "逆ピラミッド",
  "topset-backoff": "トップ+バックオフ",
  "five-by-five": "5x5",
};

export const SET_TYPE_OPTIONS: SetType[] = [
  "straight",
  "pyramid",
  "reverse-pyramid",
  "topset-backoff",
  "five-by-five",
];

export function defaultSetsForType(setType: SetType, baseWeight = 75): SetRecord[] {
  const rounded = Math.round(baseWeight / 2.5) * 2.5;
  if (setType === "five-by-five") {
    return Array.from({ length: 5 }, (_, index) => ({
      setNumber: index + 1,
      weight: rounded,
      reps: 5,
    }));
  }
  if (setType === "pyramid") {
    return [0.85, 0.92, 1, 0.92].map((rate, index) => ({
      setNumber: index + 1,
      weight: Math.round((rounded * rate) / 2.5) * 2.5,
      reps: index === 2 ? 3 : 5,
    }));
  }
  if (setType === "reverse-pyramid") {
    return [1, 0.93, 0.88, 0.84].map((rate, index) => ({
      setNumber: index + 1,
      weight: Math.round((rounded * rate) / 2.5) * 2.5,
      reps: 4 + index,
    }));
  }
  if (setType === "topset-backoff") {
    return [
      { setNumber: 1, weight: rounded + 5, reps: 3 },
      { setNumber: 2, weight: rounded, reps: 6 },
      { setNumber: 3, weight: rounded, reps: 6 },
      { setNumber: 4, weight: rounded, reps: 6 },
    ];
  }
  return Array.from({ length: 3 }, (_, index) => ({
    setNumber: index + 1,
    weight: rounded,
    reps: 5,
  }));
}
