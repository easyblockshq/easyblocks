import { SupabaseClient } from "@supabase/supabase-js";

export async function createNewConfig(
  supabase: SupabaseClient,
  config: any,
  parent_id?: string
): Promise<{ status: "error" | "success"; data: any }> {
  const addConfigResult = await supabase
    .from("configs")
    .insert({ config, parent_id })
    .select();

  if (addConfigResult.error) {
    return {
      status: "error",
      data: addConfigResult.error,
    };
  }

  if (addConfigResult.data === null) {
    return {
      status: "error",
      data: "null data",
    };
  }

  return {
    status: "success",
    data: addConfigResult.data[0],
  };
}
