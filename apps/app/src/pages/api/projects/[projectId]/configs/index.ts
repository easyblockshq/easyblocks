import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../helpers/withCors";
import { createSupabaseClient } from "../../../../../createSupabaseClient";

/**
 * This endpoint is used only for the purpose of one ugly hack.
 * We still don't have document picker view (when logged in to standalone Shopstory)
 * It means that we always use last-modified config.
 * If projectId is "demo" then we use THIS endpoint to get it.
 *
 * When documents view appears, it's the first thing to remove.
 *
 */
const handler: AuthenticatedNextApiHandler = async (
  request,
  response,
  accessToken
) => {
  try {
    const projectId = request.query.projectId as string;
    const supabase = createSupabaseClient(accessToken, projectId);

    if (request.method === "GET") {
      const { data, error } = await supabase
        .from("configs")
        .select("config, created_at, templates (id)")
        .order("created_at", { ascending: false })
        .limit(25);

      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal server error" });
      }

      return response.status(200).json(data);
    }

    return response.status(400).json({
      error: `Invalid method`,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
};

export default withCors(withAccessToken(handler));
