import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabaseSchema";
import { TableRecord } from "./types";

class ProjectsRepository {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async getById(projectId: string) {
    const { data, error } = await this.supabaseClient
      .from("projects")
      .select("id, name, tokens")
      .eq("id", projectId);

    if (error) {
      throw error;
    }

    return data?.[0] ?? null;
  }

  async getByType(type: string) {
    const { data, error } = await this.supabaseClient
      .from("projects")
      .select("id, name, tokens")
      .eq("type", type)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async update(
    projectId: string,
    properties: Partial<TableRecord<"projects">>
  ) {
    const { data, error } = await this.supabaseClient
      .from("projects")
      .update(properties)
      .eq("id", projectId)
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }
}

async function getProjects(supabaseClient: SupabaseClient<Database>) {
  const { data, error } = await supabaseClient
    .from("projects")
    .select("id, name, tokens");

  if (error) {
    throw error;
  }

  return data;
}

export { ProjectsRepository, getProjects };
