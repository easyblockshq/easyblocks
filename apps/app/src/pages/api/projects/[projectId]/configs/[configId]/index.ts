import { NoCodeComponentEntry } from "@easyblocks/core";
import { toArray } from "@easyblocks/utils";
import { z } from "zod";
import { createSupabaseClient } from "../../../../../../createSupabaseClient";
import { buildLocales } from "../../../../../../helpers/buildLocales";
import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../../helpers/withCors";
import { splitConfigIntoSingleLocaleConfigs } from "../../../../../../lib/splitConfigs";

const handlerQuerySchema = z.object({
  projectId: z.string(),
  configId: z.string(),
  locale: z.union([z.string(), z.array(z.string())]).optional(),
});

const handler: AuthenticatedNextApiHandler = async (
  request,
  response,
  accessToken
) => {
  try {
    const parseQueryResult = handlerQuerySchema.safeParse(request.query);

    if (!parseQueryResult.success) {
      return response.status(400).json({
        error: "Bad request",
      });
    }

    const { projectId, configId, locale } = parseQueryResult.data;

    const supabase = createSupabaseClient(accessToken, projectId);

    if (request.method === "GET") {
      const { data, error } = await supabase
        .from("configs")
        .select("config, created_at")
        .eq("id", configId);

      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal server error" });
      }

      const result = data[0];

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
          data[0].config as NoCodeComponentEntry,
          locales
        );

        result.config = singleLocaleConfig[locales[0].code];
      }

      return response.status(200).json(result);
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
