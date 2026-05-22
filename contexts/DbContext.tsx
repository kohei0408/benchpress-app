import { createContext, useContext } from "react";
import * as SQLite from "expo-sqlite";

export const DbContext = createContext<SQLite.SQLiteDatabase | null>(null);

export function useDb() {
  return useContext(DbContext);
}
