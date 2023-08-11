import { createClient } from "@supabase/supabase-js";
import { Database } from "@/infrastructure/supabaseSchema";

const SUPABASE_API_URL = process.env.SUPABASE_API_URL ?? "";
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY ?? "";

export function createSupabaseClient(accessToken: string, projectId?: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  /**
   * x-project-id is responsible for scoping Postgres queries to a selected project.
   * If project is not defined, then even if user has access to the project (via correct user token), then db won't pass the requests.
   */
  if (projectId) {
    headers["x-project-id"] = projectId;
  }

  return createClient<Database>(SUPABASE_API_URL, SUPABASE_API_KEY, {
    auth: {
      persistSession: false,
    },
    global: {
      headers,
    },
  });
}
