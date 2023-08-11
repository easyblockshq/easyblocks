import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../helpers/withAccessToken";
import { withCors } from "../../../helpers/withCors";
import { createSupabaseClient } from "../../../createSupabaseClient";
import { getProjects } from "../../../infrastructure/ProjectsRepository";

const handler: AuthenticatedNextApiHandler = async (req, res, accessToken) => {
  const supabaseClient = createSupabaseClient(accessToken);

  if (req.method === "GET") {
    try {
      const projects = await getProjects(supabaseClient);
      res.status(200).json(projects);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  res.status(400).json({ error: "Invalid method" });
};

export default withCors(withAccessToken(handler));
