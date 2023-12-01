import { serialize } from "@easyblocks/utils";
import { z } from "zod";
import { buildEntry } from "./buildEntry";
import { ShopstoryAccessTokenApiAuthenticationStrategy } from "./infrastructure/ShopstoryAccessTokenApiAuthenticationStrategy";
import { ApiClient } from "./infrastructure/apiClient";
import { getFallbackLocaleForLocale } from "./locales";
import type {
  ChangedExternalData,
  CompilerModule,
  ComponentConfig,
  Config,
  RenderableDocument,
} from "./types";
import { compile, findExternals, validate } from "./compiler";

async function buildDocument({
  documentId,
  config,
  locale,
}: {
  documentId: string;
  config: Config;
  locale: string;
}): Promise<{
  renderableDocument: RenderableDocument;
  externalData: ChangedExternalData;
}> {
  const { entry, rootContainer } = await resolveEntryForDocument({
    documentId,
    config,
    locale,
  });

  const compiler: CompilerModule = {
    compile,
    findExternals,
    validate,
  };

  const { meta, externalData, renderableContent, configAfterAuto } = buildEntry(
    {
      entry,
      config,
      contextParams: {
        locale,
        rootContainer,
      },
      compiler,
      externalData: {},
    }
  );

  return {
    renderableDocument: {
      renderableContent,
      meta: serialize(meta),
      configAfterAuto,
    },
    externalData,
  };
}

export { buildDocument };

async function resolveEntryForDocument({
  documentId,
  config,
  locale,
}: {
  documentId: string;
  config: Config;
  locale: string;
}): Promise<{ entry: ComponentConfig; rootContainer: string }> {
  const apiClient = new ApiClient(
    new ShopstoryAccessTokenApiAuthenticationStrategy(config.accessToken)
  );
  const locales = buildLocalesWithFallbacksForLocale(config.locales, locale);
  const { projectId } = parseAccessTokenPayload(config.accessToken);

  try {
    const documentResponse = await apiClient.documents.getDocumentById({
      documentId,
      projectId: projectId,
      locales,
    });

    if (!documentResponse) {
      throw new Error(`Document with id ${documentId} not found.`);
    }

    return {
      entry: documentResponse.config.config,
      rootContainer: documentResponse.root_container!,
    };
  } catch {
    throw new Error(`Error fetching document with id ${documentId}.`);
  }
}

function buildLocalesWithFallbacksForLocale(
  locales: Config["locales"],
  locale: string
): Array<string> {
  // TODO: Should locales be required?
  if (!locales) {
    throw new Error("Property 'locales' is required in Easyblocks config.");
  }

  const resultLocales: Array<string> = [locale];
  let lastLocale = locale;

  while (true) {
    const fallbackLocale = getFallbackLocaleForLocale(lastLocale, locales);

    if (!fallbackLocale) {
      break;
    }

    resultLocales.push(fallbackLocale);
    lastLocale = fallbackLocale;
  }

  return resultLocales;
}

const accessTokenPayloadSchema = z.object({ project_id: z.string() });

function parseAccessTokenPayload(accessToken: string) {
  const base64UrlEncodedPayload = accessToken.split(".")[1];
  const decodedPayload = decodePayload(base64UrlEncodedPayload);
  const payload = accessTokenPayloadSchema.parse(JSON.parse(decodedPayload));

  return {
    projectId: payload.project_id,
  };
}

function decodePayload(payload: string) {
  if (typeof global === "object") {
    const decodedPayload = Buffer.from(payload, "base64").toString("utf-8");

    return decodedPayload;
  }

  const base64EncodedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decodedPayload = decodeURIComponent(
    window
      .atob(base64EncodedPayload)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return decodedPayload;
}
