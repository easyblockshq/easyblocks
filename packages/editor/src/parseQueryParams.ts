import type { ContextParams } from "@easyblocks/core";

export function parseQueryParams(): {
  documentId: undefined | string;
  projectId: undefined | string;
  accessToken: undefined | string;
  mode: "playground" | "app";
  widthAuto: boolean;
  width: number | undefined;
  contextParams: ContextParams | undefined;
  preview: boolean;
} {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const queryParams = Object.fromEntries(urlSearchParams.entries());
  const contextParams = parseContextParams(queryParams.contextParams);

  return {
    documentId: queryParams.documentId,
    projectId: queryParams.projectId,
    /**
     * We need shopstoryAccessToken for non-cloud versions - they rely on this query param.
     * It can be removed only when all clients move to cloud based version and 1.0.0 SDK.
     */
    accessToken: queryParams.shopstoryAccessToken ?? queryParams.accessToken,
    mode: queryParams.mode === "app" ? "app" : "playground",
    widthAuto: queryParams.widthAuto === "true" ? true : false,
    width: queryParams.width ? parseInt(queryParams.width) : undefined,
    contextParams,
    preview: queryParams.preview === "true",
  };
}

function parseContextParams(contextParamsQueryParameter: string) {
  try {
    const contextParams = JSON.parse(
      decodeURIComponent(contextParamsQueryParameter)
    );
    return contextParams as ContextParams;
  } catch {
    return undefined;
  }
}
