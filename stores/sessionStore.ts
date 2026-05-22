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
  setSessions: (sessions: WorkoutSession[]) => void;
  addSession: (session: WorkoutSession) => void;
  startDraft: (setType: SetType) => void;
  updateDraftSet: (setNumber: number, patch: Partial<Pick<SetRecord, "weight" | "reps" | "rpe">>) => void;
  nextSet: () => void;
  finishDraft: () => WorkoutSession | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  draft: null,
  profile: {
    targetWeight: 100,
    barWeight: 20,
    oneRmFormula: "epley",
  },
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
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
    set({ draft: null });
    return session;
  },
  updateProfile: (profile) => set({ profile: { ...get().profile, ...profile } }),
}));
