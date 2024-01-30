import { NoCodeComponentEntry } from "@easyblocks/core";
import { toArray } from "@easyblocks/utils";
import { buildLocales } from "../../../helpers/buildLocales";
import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../helpers/withAccessToken";
import { withCors } from "../../../helpers/withCors";
import { createSupabaseClient } from "../../../createSupabaseClient";
import { splitConfigIntoSingleLocaleConfigs } from "../../../lib/splitConfigs";

/**
 * This endpoint is for now use ONLY by:
 * 1. Generating template previews (anonymous token authorization)
 * 2. Downloading config by ShopstoryClient (anonymous token authorization)
 *
 * Basically both cases use anonymous token authorization and they're external non-editor interaction with API.
 * Editor-first interactions using user-token are available only via project-specific endpoints.
 * It's an additional protection making sure that projects don't "leak".
 *
 */
const handler: AuthenticatedNextApiHandler = async (
  request,
  response,
  accessToken
) => {
  try {
    const supabase = createSupabaseClient(accessToken);
    const { id, locale: localeSearchParam } = request.query;

    if (Array.isArray(id)) {
      throw new Error("id cant be array");
    }

    if (request.method === "GET") {
      const { data, error } = await supabase
        .from("configs")
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

      const result = data[0];

      if (localeSearchParam) {
        const localeCodes = toArray(localeSearchParam);

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
