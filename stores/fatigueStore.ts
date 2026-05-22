import { create } from "zustand";
import * as SQLite from "expo-sqlite";
import { saveFatigueLog } from "@/db/queries";
import type { FatigueLog, MuscleGroup } from "@/types";

interface FatigueStore {
  latest: FatigueLog;
  setLatest: (latest: FatigueLog) => void;
  saveLog: (db: SQLite.SQLiteDatabase, log: FatigueLog) => Promise<void>;
  setSleepHours: (sleepHours: number) => void;
  toggleMuscle: (muscle: MuscleGroup) => void;
}

function computeFatigueScore(sleepHours: number, soreMuscles: MuscleGroup[]): number {
  const sleepPenalty = sleepHours >= 7 ? 0 : Math.min(35, (7 - sleepHours) * 10);
  const musclePenalty = soreMuscles.length * 12;
  return Math.min(100, Math.round(20 + sleepPenalty + musclePenalty));
}

export const useFatigueStore = create<FatigueStore>((set, get) => ({
  latest: {
    date: new Date().toISOString(),
    sleepHours: 7,
    soreMuscles: ["pectoralis"],
    fatigueScore: 32,
  },
  setLatest: (latest) => set({ latest }),
  saveLog: async (db, log) => {
    try {
      await saveFatigueLog(db, log);
      set({ latest: log });
    } catch (err) {
      console.error("Fatigue log save error:", err);
      throw err;
    }
  },
  setSleepHours: (sleepHours) => {
    const latest = get().latest;
    set({
      latest: {
        ...latest,
        sleepHours,
        date: new Date().toISOString(),
        fatigueScore: computeFatigueScore(sleepHours, latest.soreMuscles),
      },
    });
  },
  toggleMuscle: (muscle) => {
    const latest = get().latest;
    const soreMuscles = latest.soreMuscles.includes(muscle)
      ? latest.soreMuscles.filter((item) => item !== muscle)
      : [...latest.soreMuscles, muscle];
    set({
      latest: {
        ...latest,
        soreMuscles,
        date: new Date().toISOString(),
        fatigueScore: computeFatigueScore(latest.sleepHours, soreMuscles),
      },
    });
  },
}));
