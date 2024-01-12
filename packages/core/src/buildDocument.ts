import { serialize } from "@easyblocks/utils";
import { buildEntry } from "./buildEntry";
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

  try {
    const documentResponse = await backend.documents.get({
      id: documentId,
      locale,
    });

    if (!documentResponse) {
      throw new Error(`Document with id ${documentId} not found.`);
    }

    return documentResponse;
  } catch {
    throw new Error(`Error fetching document with id ${documentId}.`);
  }
}
