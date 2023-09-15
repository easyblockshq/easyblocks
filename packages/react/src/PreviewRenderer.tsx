import type {
  Config,
  ContextParams,
  ExternalData,
  RenderableDocument,
} from "@easyblocks/core";
import React, { useEffect, useState } from "react";
import { Easyblocks } from "./Easyblocks";
import { parseQueryParams } from "./parseQueryParams";

type TemplateRendererProps = {
  config: Config;
  contextParams?: ContextParams;
};

export const PreviewRenderer: React.FC<TemplateRendererProps> = ({
  config,
}) => {
  const [data, setData] = useState<{
    renderableDocument: RenderableDocument;
    externalData: ExternalData;
  } | null>(null);

  useEffect(() => {
    import("@easyblocks/core").then(({ buildPreview }) => {
      const {
        documentId,
        projectId,
        accessToken,
        width,
        widthAuto,
        contextParams,
      } = parseQueryParams();

      if (!documentId || !projectId) {
        throw new Error("unreachable");
      }

      if (!accessToken) {
        throw new Error("can't render preview without access token");
      }

      if (!contextParams) {
        throw new Error("can't render preview without context params");
      }

      buildPreview(
        documentId,
        projectId,
        width,
        widthAuto,
        accessToken,
        config,
        contextParams
      );
    });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <Easyblocks
      renderableDocument={data.renderableDocument}
      externalData={data.externalData}
    />
  );
};
