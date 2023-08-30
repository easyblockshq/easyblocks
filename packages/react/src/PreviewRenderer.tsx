import type { Config, ContextParams } from "@easyblocks/core";
import React, { useEffect, useState } from "react";
import { parseQueryParams } from "./parseQueryParams";
import { Shopstory } from "./Shopstory";
import { ShopstoryMetadataProvider } from "./ShopstoryMetadataProvider";

type TemplateRendererProps = {
  config: Config;
  contextParams?: ContextParams;
};

export const PreviewRenderer: React.FC<TemplateRendererProps> = ({
  config,
}) => {
  const [data, setData] = useState<any>(null);

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
      ).then(({ meta, renderableContent }) => {
        setData({
          meta,
          renderableContent,
        });
      });
    });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <ShopstoryMetadataProvider meta={data.meta}>
      <Shopstory content={data.renderableContent} />
    </ShopstoryMetadataProvider>
  );
};
