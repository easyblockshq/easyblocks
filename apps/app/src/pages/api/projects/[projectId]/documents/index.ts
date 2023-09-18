import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../helpers/withCors";
import { createSupabaseClient } from "../../../../../createSupabaseClient";
import { createNewConfig } from "../../../../../createNewConfig";

const handler: AuthenticatedNextApiHandler = async (
  request,
  response,
  accessToken
) => {
  try {
    const projectId = request.query.projectId;

    if (Array.isArray(projectId)) {
      return response.status(400).json({ error: "projectId can't be array" });
    }

    const supabase = createSupabaseClient(accessToken, projectId);

    if (request.method === "POST") {
      const input = request.body;

      if (input.unique_source_identifier) {
        const result = await supabase
          .from("documents")
          .select()
          .eq("unique_source_identifier", input.unique_source_identifier);

        if (result.error) {
          return response.status(400).json({ error: result.error });
        }

        if (result.data.length > 0) {
          return response.status(400).json({
            error: `Document with unique_source_identifier "${input.unique_source_identifier}" already exists`,
          });
        }
      }

      const createConfigResult = await createNewConfig(supabase, input.config);

      if (createConfigResult.status === "error") {
        response.status(400).json({ error: createConfigResult.data });
        return;
      }

      const configData = createConfigResult.data;

      /**
       * Create document
       */
      const insertDocumentResult = await supabase
        .from("documents")
        .insert({
          title: input.title,
          unique_source_identifier: input.unique_source_identifier,
          source: input.source,
          config_id: configData.id,
          root_container: input.rootContainer,
        })
        .select();

      if (insertDocumentResult.error) {
        response.status(400).json({ error: insertDocumentResult.error });
        return;
      }

      const documentData = insertDocumentResult.data[0];

      /**
       * Return result
       */
      response.status(200).json(documentData);
      return;
    } else if (request.method === "GET") {
      const result = await supabase
        .from("documents")
        .select("*, configs(created_at)")
        .neq("archived", true)
        .order("created_at", { foreignTable: "configs", ascending: false });

      if (result.error) {
        response.status(400).json({ error: result.error });
        return;
      }

      const data = result.data.map((document) => {
        const newDocument = { ...document };
        // @ts-ignore
        newDocument.updated_at = document.configs.created_at;
        delete newDocument.configs;
        return newDocument;
      });

      response.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
};

export default withCors(withAccessToken(handler));
