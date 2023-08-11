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

  if (req.method === "POST") {
    const supabaseClient = createSupabaseClient(accessToken);
    const projectsRepository = new ProjectsRepository(supabaseClient);
    const projectId = await new ProjectIdResolver(projectsRepository).resolve(
      parseResult.data.projectId
    );
    const project = await projectsRepository.getById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const newToken = TokenService.getAccessToken(projectId);

    await projectsRepository.update(projectId, {
      tokens: [...project.tokens, newToken],
    });

    return res.json({ token: newToken });
  }

  res.status(400).json({ error: "Invalid method" });
};

export default withCors(withAccessToken(handler));
