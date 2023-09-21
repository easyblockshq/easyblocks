import { getAppUrlRoot } from "@easyblocks/utils";
import { buildDocument } from "./buildDocument";
import { Config, ContextParams } from "./types";

export async function buildPreview(
  documentId: string,
  projectId: string,
  width: number | undefined,
  widthAuto: boolean | undefined,
  accessToken: string,
  config: Config,
  contextParams: ContextParams
) {
  const response = await fetch(
    `${getAppUrlRoot()}/api/projects/${projectId}/documents/${documentId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-shopstory-access-token": accessToken,
      },
    }
  );

  const data = await response.json();

  const { externalData, renderableDocument } = await buildDocument({
    document: {
      documentId,
      projectId,
      rootContainer: "content",
      config: {
        _id: "root",
        _template: "$ComponentContainer",
        widthAuto: widthAuto ?? false,
        width: width ?? 5000,
        Component: [data.config.config],
      },
    },
    config: { ...config, accessToken },
    locale: contextParams.locale,
  });

  return { renderableDocument, externalData };
}
