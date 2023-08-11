import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../helpers/withCors";
import { createSupabaseClient } from "../../../../../createSupabaseClient";
import { updateMappingsForTemplate } from "../../../../../updateMappingsForTemplate";

const handler: AuthenticatedNextApiHandler = async (
  request,
  response,
  accessToken
) => {
  try {
    const { id } = request.query;

    if (Array.isArray(id)) {
      throw new Error("id cant be array");
    }

    const projectId = request.query.projectId as string;

    const supabase = createSupabaseClient(accessToken, projectId);
    const input = request.body;

    if (request.method === "PUT") {
      /**
       * Update template
       */
      const updateTemplateResult = await supabase
        .from("templates")
        .update({
          label: input.label,
        })
        .in("id", [id])
        .select();

      if (updateTemplateResult.error) {
        response.status(400).json({ error: updateTemplateResult.error });
        return;
      }

      const templateData = updateTemplateResult.data[0];

      if (!templateData) {
        response.status(400).json({ error: "Not found" });
        return;
      }

      await updateMappingsForTemplate(
        templateData.id,
        input.masterTemplateIds ?? [],
        supabase
      );

      response.status(200).json({
        ...templateData,
        mapTo: input.masterTemplateIds ?? [],
      });

      return;
    } else if (request.method === "GET") {
      const { data, error } = await supabase
        .from("templates")
        .select()
        .in("id", [id]);

      if (data?.length === 0) {
        response.status(400).json({ error: "Not found" });
        return;
      }

      if (error) {
        response.status(400).json({ error });
        return;
      }

      response.status(200).json(data[0]);
      return;
    } else if (request.method === "DELETE") {
      const { data, error } = await supabase
        .from("templates")
        .update({ archived: true })
        .in("id", [id])
        .select();

      if (data?.length === 0) {
        response.status(400).json({ error: "Not found" });
        return;
      }

      if (error) {
        response.status(400).json({ error });
        return;
      }

      await updateMappingsForTemplate(id, [], supabase);

      response.status(200).json(null);
      return;
    } else {
      response.status(400).json({
        error: `Invalid method`,
      });
      return;
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
};

export default withCors(withAccessToken(handler));
