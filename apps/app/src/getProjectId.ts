import { ProjectsRepository } from "./infrastructure/ProjectsRepository";
import { ProjectIdResolver } from "./infrastructure/ProjectIdResolver";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProjectId(
  projectIdOrLabel: string,
  supabase: SupabaseClient
) {
  const projectsRepository = new ProjectsRepository(supabase);
  return await new ProjectIdResolver(projectsRepository).resolve(
    projectIdOrLabel
  );
}
