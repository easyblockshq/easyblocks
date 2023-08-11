import { z } from "zod";
import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../helpers/withAccessToken";
import { withCors } from "../../../../helpers/withCors";
import { createSupabaseClient } from "../../../../createSupabaseClient";
import { ProjectIdResolver } from "../../../../infrastructure/ProjectIdResolver";
import { ProjectsRepository } from "../../../../infrastructure/ProjectsRepository";
import { TokenService } from "../../../../infrastructure/TokensService";

const paramsSchema = z.object({
  projectId: z.string(),
});

const handler: AuthenticatedNextApiHandler = async (req, res, accessToken) => {
  const parseResult = paramsSchema.safeParse(req.query);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Missing project id" });
  }

  const supabaseClient = createSupabaseClient(accessToken);

  if (req.method === "GET") {
    const projectsRepository = new ProjectsRepository(supabaseClient);
    const projectId = await new ProjectIdResolver(projectsRepository).resolve(
      parseResult.data.projectId
    );
    const project = await projectsRepository.getById(projectId);

    try {
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // If project has no tokens, we make sure to create one for it.
      if (project.tokens.length === 0) {
        const newToken = TokenService.getAccessToken(project.id);
        const updatedProject = await projectsRepository.update(project.id, {
          tokens: [newToken],
        });

        return res.status(200).json(updatedProject);
      }

      return res.status(200).json(project);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  res.status(400).json({ error: "Invalid method" });
};

export default withCors(withAccessToken(handler));
