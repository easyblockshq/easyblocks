"use client";

import { useMockService } from "@/data/MockData/useMockService";
import {
  buildDocument,
  ExternalData,
  RenderableDocument,
} from "@easyblocks/core";
import { Easyblocks } from "@easyblocks/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AcmeEasyblocksProvider } from "../../../../easyblocks/AcmeEasyblocksProvider";
import { easyblocksConfig } from "../../../../easyblocks/easyblocks.config";
import { createMyCustomFetch } from "../../../../easyblocks/myCustomFetch";

export default function EntryPreviewPage() {
  const params = useParams();
  const mockService = useMockService();
  const [renderableDocument, setRenderableDocument] =
    useState<RenderableDocument | null>(null);
  const [externalData, setExternalData] = useState<ExternalData>({});

  useEffect(() => {
    if (!mockService || !params || typeof params.id !== "string") {
      return;
    }

    const entry = mockService.getEntryById(params.id);

    if (!entry || !entry.page) {
      return;
    }

    buildDocument({
      document: {
        documentId: entry.page.id,
        projectId: entry.page.projectId,
        rootContainer: entry.page.rootContainer,
      },
      config: easyblocksConfig,
      locale: "en",
    }).then(({ renderableDocument, externalData }) => {
      const myCustomFetch = createMyCustomFetch(easyblocksConfig.accessToken);

      myCustomFetch({
        ...externalData,
        ...(entry.type === "product" && {
          "$.rootResource": {
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
  }, [mockService, params]);

  if (!renderableDocument) {
    return null;
  }

  return (
    <AcmeEasyblocksProvider>
      <Easyblocks
        renderableDocument={renderableDocument}
        externalData={externalData}
      />
    </AcmeEasyblocksProvider>
  );
}
