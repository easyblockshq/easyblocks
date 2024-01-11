import { serialize } from "@easyblocks/utils";
import { buildEntry } from "./buildEntry";
import { getFallbackLocaleForLocale } from "./locales";
import type {
  ChangedExternalData,
  CompilerModule,
  Document,
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
  const { entry, type } = await resolveEntryForDocument({
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
        rootContainer: type,
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
}): Promise<Document> {
  const backend = config.backend;
  await backend.init?.();

  const locales = buildLocalesWithFallbacksForLocale(config.locales, locale);

  try {
    const documentResponse = await backend.documents.get({
      id: documentId,
      locales,
    });

    if (!documentResponse) {
      throw new Error(`Document with id ${documentId} not found.`);
    }

    return documentResponse;
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
