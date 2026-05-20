import * as SQLite from "expo-sqlite";
import { SCHEMA_STATEMENTS } from "@/db/schema";
import type { FatigueLog, SetRecord, SetType, WorkoutSession } from "@/types";

const DATABASE_NAME = "benchmax.db";

interface WorkoutRow {
  id: string;
  date: string;
  set_type: SetType;
  sets_json: string;
  estimated_1rm: number;
  notes: string | null;
}

interface FatigueRow {
  date: string;
  sleep_hours: number;
  sore_muscles_json: string;
  fatigue_score: number;
}

export async function openBenchmaxDb() {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  for (const statement of SCHEMA_STATEMENTS) {
    await db.execAsync(statement);
  }
  return db;
}

export async function saveWorkoutSession(db: SQLite.SQLiteDatabase, session: WorkoutSession) {
  await db.runAsync(
    `INSERT OR REPLACE INTO workout_sessions
      (id, date, set_type, sets_json, estimated_1rm, notes)
      VALUES (?, ?, ?, ?, ?, ?);`,
    session.id,
    session.date,
    session.setType,
    JSON.stringify(session.sets),
    session.estimated1RM,
    session.notes ?? null,
  );
}

export async function listWorkoutSessions(db: SQLite.SQLiteDatabase): Promise<WorkoutSession[]> {
  const rows = await db.getAllAsync<WorkoutRow>(
    "SELECT * FROM workout_sessions ORDER BY date DESC LIMIT 50;",
  );
  return rows.map((row) => ({
    id: row.id,
    date: row.date,
    setType: row.set_type,
    sets: JSON.parse(row.sets_json) as SetRecord[],
    estimated1RM: row.estimated_1rm,
    notes: row.notes ?? undefined,
  }));
}

export async function saveFatigueLog(db: SQLite.SQLiteDatabase, log: FatigueLog) {
  await db.runAsync(
    `INSERT OR REPLACE INTO fatigue_logs
      (date, sleep_hours, sore_muscles_json, fatigue_score)
      VALUES (?, ?, ?, ?);`,
    log.date,
    log.sleepHours,
    JSON.stringify(log.soreMuscles),
    log.fatigueScore,
  );
}

export async function latestFatigueLog(db: SQLite.SQLiteDatabase): Promise<FatigueLog | null> {
  const row = await db.getFirstAsync<FatigueRow>(
    "SELECT * FROM fatigue_logs ORDER BY date DESC LIMIT 1;",
  );
  if (!row) {
    return null;
  }
  return {
    date: row.date,
    sleepHours: row.sleep_hours,
    soreMuscles: JSON.parse(row.sore_muscles_json) as FatigueLog["soreMuscles"],
    fatigueScore: row.fatigue_score,
  };
}
