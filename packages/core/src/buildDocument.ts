import { buildEntry } from "./buildEntry";
import { createResourcesStore } from "./createResourcesStore";
import { ApiClient } from "./infrastructure/apiClient";
import { ShopstoryAccessTokenApiAuthenticationStrategy } from "./infrastructure/ShopstoryAccessTokenApiAuthenticationStrategy";
import { loadCompilerScript } from "./loadScripts";
import { getFallbackLocaleForLocale } from "./locales";
import {
  ChangedExternalData,
  ComponentConfig,
  Config,
  Document,
  RenderableDocument,
} from "./types";

async function buildDocument({
  document,
  config,
  locale,
}: {
  document: Document;
  config: Config;
  locale: string;
}): Promise<{
  renderableDocument: RenderableDocument;
  externalData: ChangedExternalData;
}> {
  const entry = await resolveEntryForDocument({
    document,
    config,
    locale,
  });
  const compiler = await loadCompilerScript();
  const resourcesStore = createResourcesStore();

  const { meta, externalData, renderableContent, configAfterAuto } = buildEntry(
    {
      entry,
      config,
      contextParams: {
        locale,
        rootContainer: document.rootContainer,
      },
      compiler,
      resourcesStore,
    }
  );

  return {
    renderableDocument: {
      renderableContent,
      meta: meta,
      configAfterAuto,
    },
    externalData,
  };
}

export { buildDocument };

async function resolveEntryForDocument({
  document,
  config,
  locale,
}: {
  document: Document;
  config: Config;
  locale: string;
}): Promise<ComponentConfig> {
  if (document.config) {
    return document.config;
  }

  const apiClient = new ApiClient(
    new ShopstoryAccessTokenApiAuthenticationStrategy(config.accessToken)
  );
  const locales = buildLocalesWithFallbacksForLocale(config.locales, locale);

  try {
    const documentResponse = await apiClient.documents.getDocumentById({
      documentId: document.documentId,
      projectId: document.projectId,
      locales,
    });

    if (!documentResponse) {
      throw new Error(`Document with id ${document.documentId} not found.`);
    }

    return documentResponse.config.config;
  } catch {
    throw new Error(`Error fetching document with id ${document.documentId}.`);
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
