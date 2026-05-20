import { create } from "zustand";
import { bestEstimatedOneRm, totalVolume } from "@/constants/formulas";
import { defaultSetsForType } from "@/constants/setTypes";
import type { OneRmFormula, SetRecord, SetType, UserProfile, WorkoutSession } from "@/types";

interface SessionDraft {
  setType: SetType;
  sets: SetRecord[];
  currentIndex: number;
}

interface SessionStore {
  sessions: WorkoutSession[];
  draft: SessionDraft | null;
  profile: UserProfile;
  startDraft: (setType: SetType) => void;
  updateDraftSet: (setNumber: number, patch: Partial<Pick<SetRecord, "weight" | "reps" | "rpe">>) => void;
  nextSet: () => void;
  finishDraft: () => WorkoutSession | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const seedSessions: WorkoutSession[] = [
  {
    id: "seed-4",
    date: new Date(Date.now() - 21 * 86400000).toISOString(),
    setType: "straight",
    sets: defaultSetsForType("straight", 72.5),
    estimated1RM: 84.6,
  },
  {
    id: "seed-3",
    date: new Date(Date.now() - 14 * 86400000).toISOString(),
    setType: "five-by-five",
    sets: defaultSetsForType("five-by-five", 75),
    estimated1RM: 87.5,
  },
  {
    id: "seed-2",
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    setType: "topset-backoff",
    sets: defaultSetsForType("topset-backoff", 75),
    estimated1RM: 88,
  },
  {
    id: "seed-1",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    setType: "straight",
    sets: defaultSetsForType("straight", 77.5),
    estimated1RM: 90.4,
  },
];

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: seedSessions,
  draft: null,
  profile: {
    targetWeight: 100,
    barWeight: 20,
    oneRmFormula: "epley",
  },
  startDraft: (setType) => {
    const latestSameType = get().sessions.find((session) => session.setType === setType);
    const latestBest = get().sessions[0]?.sets[0]?.weight ?? 75;
    const sets = latestSameType?.sets ?? defaultSetsForType(setType, latestBest);
    set({
      draft: {
        setType,
        sets: sets.map((item) => ({ ...item })),
        currentIndex: 0,
      },
    });
  },
  updateDraftSet: (setNumber, patch) => {
    const draft = get().draft;
    if (!draft) {
      return;
    }
    set({
      draft: {
        ...draft,
        sets: draft.sets.map((setRecord) =>
          setRecord.setNumber === setNumber ? { ...setRecord, ...patch } : setRecord,
        ),
      },
    });
  },
  nextSet: () => {
    const draft = get().draft;
    if (!draft) {
      return;
    }
    set({
      draft: {
        ...draft,
        currentIndex: Math.min(draft.currentIndex + 1, draft.sets.length - 1),
      },
    });
  },
  finishDraft: () => {
    const draft = get().draft;
    if (!draft) {
      return null;
    }
    const formula: OneRmFormula = get().profile.oneRmFormula;
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      setType: draft.setType,
      sets: draft.sets,
      estimated1RM: bestEstimatedOneRm(draft.sets, formula),
      notes: `volume:${totalVolume(draft.sets)}`,
    };
    set({ sessions: [session, ...get().sessions], draft: null });
    return session;
  },
  updateProfile: (profile) => set({ profile: { ...get().profile, ...profile } }),
}));
