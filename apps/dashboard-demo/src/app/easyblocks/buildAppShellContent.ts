import { buildDocument } from "@easyblocks/core";
import { cookies } from "next/headers";
import "server-only";
import { easyblocksConfig } from "./easyblocks.config";
import { fetchExternalData } from "./fetchExternalData";

async function buildAppShellContent() {
  const cookieStore = cookies();
  const appShellDocumentId = cookieStore.get("appShellDocumentId");

  if (!appShellDocumentId) {
    return null;
  }

  const appShellDocument = await buildDocument({
    documentId: appShellDocumentId.value,
    config: easyblocksConfig,
    locale: "en",
  });

  const externalData = await fetchExternalData(appShellDocument.externalData);

  return {
    renderableDocument: appShellDocument.renderableDocument,
    externalData,
  };
}

export { buildAppShellContent };
