export const CREATE_WORKOUT_SESSIONS_TABLE = `
CREATE TABLE IF NOT EXISTS workout_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  set_type TEXT NOT NULL,
  sets_json TEXT NOT NULL,
  estimated_1rm REAL NOT NULL,
  notes TEXT
);`;

export const CREATE_FATIGUE_LOGS_TABLE = `
CREATE TABLE IF NOT EXISTS fatigue_logs (
  date TEXT PRIMARY KEY NOT NULL,
  sleep_hours REAL NOT NULL,
  sore_muscles_json TEXT NOT NULL,
  fatigue_score INTEGER NOT NULL
);`;

export const SCHEMA_STATEMENTS = [
  CREATE_WORKOUT_SESSIONS_TABLE,
  CREATE_FATIGUE_LOGS_TABLE,
] as const;
