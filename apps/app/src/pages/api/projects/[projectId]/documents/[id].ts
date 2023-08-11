import { splitConfigIntoSingleLocaleConfigs } from "@easyblocks/app-utils";
import { toArray } from "@easyblocks/utils";
import { buildLocales } from "../../../../../helpers/buildLocales";
import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../helpers/withCors";
import { createNewConfig } from "../../../../../createNewConfig";
import { createSupabaseClient } from "../../../../../createSupabaseClient";
import type { TableUpdateRecord } from "../../../../../infrastructure/types";

const DEFAULT_CONFIG_UPDATE_THRESHOLD = 1000 * 60 * 10; // 10 minutes

const handler: AuthenticatedNextApiHandler = async (
  request,
  response,
  accessToken
) => {
  try {
    const { projectId, id, identifier_type = "id" } = request.query;

    if (Array.isArray(projectId)) {
      return response.status(400).json({ error: "projectId can't be array" });
    }

    const supabase = createSupabaseClient(accessToken, projectId as string);
    const input = request.body;

    if (Array.isArray(id)) {
      throw new Error("id cant be array");
    }

    if (request.method === "PUT") {
      /**
       * Update config
       */
      let newConfigData: any = null;
      let newDocumentVersion: number | null = null;

      if (input.config) {
        if (input.version === undefined) {
          response.status(400).json({
            error: "Updating config requires specifying document's version",
          });
          return;
        }

        const inputVersion = Number(input.version);

        if (Number.isNaN(inputVersion)) {
          response.status(400).json({ error: "Version must be a number" });
          return;
        }

        const currentDocumentData = await supabase
          .from("documents")
          .select("id, config_id, version, configs(updated_at)")
          .in("id", [id]);

        if (
          currentDocumentData.error ||
          currentDocumentData.data.length === 0
        ) {
          response.status(400).json({ error: "Not found" });
          return;
        }

        const currentDocumentVersion = currentDocumentData.data[0].version;

        if (currentDocumentVersion > inputVersion) {
          response.status(400).json({ error: "Document version mismatch" });
          return;
        }

        const updatedAt = new Date(
          toArray(currentDocumentData.data[0].configs)[0].updated_at
        );

        // This header only exists for testing purposes
        const configUpdateThreshold = request.headers[
          "x-shopstory-config-update-threshold"
        ]
          ? Number(request.headers["x-shopstory-config-update-threshold"])
          : DEFAULT_CONFIG_UPDATE_THRESHOLD;

        // If the config was updated less than 5 minutes ago, we'll update the existing config
        // Otherwise, we'll create a new config
        const shouldUpdateConfig =
          Date.now() - updatedAt.getTime() < configUpdateThreshold;

        if (shouldUpdateConfig) {
          const updateConfigResult = await supabase
            .from("configs")
            .update({
              config: input.config,
            })
            .eq("id", currentDocumentData.data[0].config_id)
            .select();

          if (updateConfigResult.error) {
            return response
              .status(400)
              .json({ error: "Error while updating document" });
          }

          if (updateConfigResult.data.length === 0) {
            return response.status(400).json({ error: "Not found" });
          }

          newConfigData = updateConfigResult.data[0];
        } else {
          const parent_id = currentDocumentData.data[0].config_id;

          const createConfigResult = await createNewConfig(
            supabase,
            input.config,
            parent_id
          );

          if (createConfigResult.status === "error") {
            response.status(400).json({ error: createConfigResult.data });
            return;
          }

          newConfigData = createConfigResult.data;
        }

        newDocumentVersion = currentDocumentVersion + 1;
      }

      const updatedDocumentFields: TableUpdateRecord<"documents"> = {};

      if (input.title) {
        updatedDocumentFields.title = input.title;
      }

      if (input.unique_source_identifier) {
        updatedDocumentFields.unique_source_identifier =
          input.unique_source_identifier;
      }

      if (input.source) {
        updatedDocumentFields.source = input.source;
      }

      if (newConfigData) {
        updatedDocumentFields.config_id = newConfigData.id;
        updatedDocumentFields.version = newDocumentVersion;
      }

      const updateDocumentResult = await supabase
        .from("documents")
        .update(updatedDocumentFields)
        .in("id", [id])
        .select();

      if (updateDocumentResult.error) {
        response.status(400).json({ error: updateDocumentResult.error });
        return;
      }

      const documentData = updateDocumentResult.data[0];

      if (!documentData) {
        response.status(400).json({ error: "Not found" });
        return;
      }

      response.status(200).json(documentData);

      return;
    } else if (request.method === "GET") {
      const { format = "full", locale } = request.query;

      let documentByIdentifierQuery = supabase
        .from("documents")
        .select("*, configs(*)")
        .neq("archived", true);

      if (identifier_type === "unique_source_identifier") {
        documentByIdentifierQuery = documentByIdentifierQuery.eq(
          "unique_source_identifier",
          id
        );
      } else {
        documentByIdentifierQuery = documentByIdentifierQuery.in("id", [id]);
      }

      const { data, error } = await documentByIdentifierQuery;

      if (data?.length === 0) {
        response.status(400).json({ error: "Not found" });
        return;
      }

      if (error) {
        response.status(400).json({ error });
        return;
      }

      if (format === "versionOnly") {
        const result = {
          version: data[0].version,
        };

        return response.status(200).json(result);
      }

      const returnData: Record<string, any> = {
        ...data[0],
      };

      returnData.config = returnData.configs;
      delete returnData.configs;

      if (locale) {
        const localeCodes = toArray(locale);

        if (
          localeCodes.length === 0 ||
          (localeCodes.length === 1 && localeCodes[0] === "")
        ) {
          return response.status(400).json({
            error:
              "Invalid locales search parameter, at least one locale is required",
          });
        }

        const locales = buildLocales(localeCodes);
        const singleLocaleConfig = splitConfigIntoSingleLocaleConfigs(
          returnData.config.config,
          locales
        );

        returnData.config.config = singleLocaleConfig[locales[0].code];
      }

      response.status(200).json(returnData);
      return;
    } else if (request.method === "DELETE") {
      const { data, error } = await supabase
        .from("documents")
        .update({ archived: true })
        .in("id", [id])
        .select();

      if (data?.length === 0) {
        response.status(404).json({ error: "Not found" });
        return;
      }

      if (error) {
        console.log(error);
        response.status(400).json({ error });
        return;
      }

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
