import { Database } from "./supabaseSchema";

type TableRecord<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

type TableUpdateRecord<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type { TableRecord, TableUpdateRecord };
