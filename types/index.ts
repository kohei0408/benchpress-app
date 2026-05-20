export type SetType =
  | "straight"
  | "pyramid"
  | "reverse-pyramid"
  | "topset-backoff"
  | "five-by-five";

export type MuscleGroup =
  | "pectoralis"
  | "anterior-delt"
  | "triceps"
  | "lat"
  | "biceps";

export type OneRmFormula = "epley" | "brzycki";

export interface SetRecord {
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
}

export interface WorkoutSession {
  id: string;
  date: string;
  setType: SetType;
  sets: SetRecord[];
  estimated1RM: number;
  notes?: string;
}

export interface FatigueLog {
  date: string;
  sleepHours: number;
  soreMuscles: MuscleGroup[];
  fatigueScore: number;
}

export interface SuccessScoreFactor {
  label: string;
  impact: number;
}

export interface SuccessScoreResult {
  score: number;
  factors: SuccessScoreFactor[];
}

export interface AIRecommendation {
  setType: SetType;
  sets: { weight: number; reps: number }[];
  comment: string;
  challengeWeight?: number;
}

export interface UserProfile {
  targetWeight: number;
  barWeight: number;
  oneRmFormula: OneRmFormula;
}
