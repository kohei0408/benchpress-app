import { useCallback, useEffect, useRef, useState } from "react";
import * as SQLite from "expo-sqlite";
import { latestFatigueLog, listWorkoutSessions, openBenchmaxDb } from "@/db/queries";
import { useFatigueStore } from "@/stores/fatigueStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { FatigueLog } from "@/types";

function defaultFatigueLog(): FatigueLog {
  return {
    date: new Date().toISOString(),
    sleepHours: 7,
    soreMuscles: [],
    fatigueScore: 20,
  };
}

export function useDbInit() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const dbRef = useRef<SQLite.SQLiteDatabase | null>(null);
  const setSessions = useSessionStore((state) => state.setSessions);
  const setLatest = useFatigueStore((state) => state.setLatest);

  const retry = useCallback(() => {
    setIsReady(false);
    setError(null);
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const db = await openBenchmaxDb();
        if (cancelled) {
          return;
        }
        dbRef.current = db;

        const [sessions, fatigueLog] = await Promise.all([
          listWorkoutSessions(db),
          latestFatigueLog(db),
        ]);
        if (cancelled) {
          return;
        }

        setSessions(sessions);
        setLatest(fatigueLog ?? defaultFatigueLog());
        setIsReady(true);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [retryCount, setLatest, setSessions]);

  return { isReady, db: dbRef.current, error, retry };
}
