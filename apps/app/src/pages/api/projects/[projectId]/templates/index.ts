import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../helpers/withCors";
import { createSupabaseClient } from "../../../../../createSupabaseClient";
import { updateMappingsForTemplate } from "../../../../../updateMappingsForTemplate";
import { createNewConfig } from "../../../../../createNewConfig";

const handler: AuthenticatedNextApiHandler = async (
  request,
  response,
  accessToken
) => {
  try {
    const projectId = request.query.projectId as string;

    const supabase = createSupabaseClient(accessToken, projectId);
    const input = request.body;

    if (request.method === "POST") {
      /**
       * Add config
       */

      const createConfigResult = await createNewConfig(supabase, input.config);

      if (createConfigResult.status === "error") {
        response.status(400).json({ error: createConfigResult.data });
        return;
      }

      const configData = createConfigResult.data;

      /**
       * Create template
       */
      const insertTemplateResult = await supabase
        .from("templates")
        .insert({
          label: input.label,
          config_id: configData.id,
          width: input.width === undefined ? undefined : parseInt(input.width),
          widthAuto: input.widthAuto,
          project_id: configData.project_id,
        })
        .select();

      if (insertTemplateResult.error) {
        response.status(400).json({ error: insertTemplateResult.error });
        return;
      }

      const templateData = insertTemplateResult.data[0];

      /**
       * Update mappings
       */
      await updateMappingsForTemplate(
        templateData.id,
        input.masterTemplateIds ?? [],
        supabase
      );

      /**
       * Return result
       */
      response.status(200).json(templateData);
      return;
    } else if (request.method === "GET") {
      const { data, error } = await supabase
        .from("templates")
        .select(
          `
          *,
          configs(
            id,
            config
          ),
          template_mappings(
            master_id
          )
        `
        )
        .neq("archived", true)
        .order("created_at", { ascending: false });

      if (error) {
        response.status(400).json({ error });
        return;
      }

      response.status(200).json(
        data.map((item) => ({
          id: item.id,
          label: item.label,
          config: item.configs,
          // @ts-ignore
          mapTo: item.template_mappings.map(
            (mapping: any) => mapping.master_id
          ),
          width: item.width,
          widthAuto: item.widthAuto,
        }))
      );
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
