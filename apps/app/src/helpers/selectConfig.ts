import { ConfigComponentIdentifier } from "@easyblocks/core";
import { createSupabaseClient } from "../createSupabaseClient";

export default async function selectConfig({
  accessToken,
  input,
}: {
  accessToken: string;
  input: ConfigComponentIdentifier[] | ConfigComponentIdentifier;
}) {
  try {
    const supabase = createSupabaseClient(accessToken);

    const ids = Array.isArray(input) ? input.map(({ id }) => id) : [input.id];

    const query = supabase
      .from("configs")
      .select("*")
      .in("id", ids as string[]);

    const { data, error } = await query;

    if (error) {
      return { data: null, error };
    }

    const configs = Array.isArray(input) ? data : data?.[0] ?? null;

    return { data: configs, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
