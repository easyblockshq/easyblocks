import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.SUPABASE_API_URL!,
  process.env.SUPABASE_API_KEY!
);

export { supabaseClient };
