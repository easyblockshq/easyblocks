"use client";

import { useMockService } from "@/data/MockData/useMockService";
import {
  buildDocument,
  ExternalData,
  RenderableDocument,
  Easyblocks,
} from "@easyblocks/core";
import { builtinEditableComponents } from "@easyblocks/editable-components";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { easyblocksConfig } from "../../../../easyblocks/easyblocks.config";
import { createMyCustomFetch } from "../../../../easyblocks/myCustomFetch";

export default function EntryPreviewPage() {
  const params = useParams();
  const mockService = useMockService();
  const [renderableDocument, setRenderableDocument] =
    useState<RenderableDocument | null>(null);
  const [externalData, setExternalData] = useState<ExternalData>({});

  useEffect(() => {
    if (!mockService || typeof params?.id !== "string") {
      return;
    }

    const entry = mockService.getEntryById(params.id);

    if (!entry || !entry.page) {
      return;
    }

    buildDocument({
      documentId: entry.page.id,
      config: easyblocksConfig,
      locale: "en",
    }).then(({ renderableDocument, externalData }) => {
      const myCustomFetch = createMyCustomFetch(easyblocksConfig.accessToken);

      myCustomFetch({
        ...externalData,
        ...(entry.type === "product" && {
          "$.product": {
            externalId: "flec-candle-holder-pink-blossom",
            type: "product",
            widgetId: "product",
          },
        }),
      }).then((fetchedExternalData) => {
        setExternalData(fetchedExternalData);
        setRenderableDocument(renderableDocument);
      });
    });
  }, [mockService, params?.id]);

  if (!renderableDocument) {
    return null;
  }

  return (
    <Easyblocks
      renderableDocument={renderableDocument}
      externalData={externalData}
      components={builtinEditableComponents()}
    />
  );
}
