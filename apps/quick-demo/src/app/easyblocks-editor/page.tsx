"use client";

import { components } from "@/app/easyblocks/components";
import { easyblocksConfig } from "@/app/easyblocks/easyblocks.config";
import { ExternalData } from "@easyblocks/core";
import { EasyblocksEditor } from "@easyblocks/editor";
import { useState } from "react";
import { mockImageWidget } from "../easyblocks/externalData/mockMedia/mockImageWidget";
import { MockImagePicker } from "../easyblocks/externalData/mockMedia/MockImagePicker";
import { mockVideoWidget } from "../easyblocks/externalData/mockMedia/mockVideoWidget";
import { MockVideoPicker } from "../easyblocks/externalData/mockMedia/MockVideoPicker";
import { createMyCustomFetch } from "../easyblocks/myCustomFetch";
import {
  PexelsImagePicker,
  pexelsImageWidget,
} from "../easyblocks/externalData/pexels/pexelsImageWidget";
import {
  PexelsVideoPicker,
  pexelsVideoWidget,
} from "../easyblocks/externalData/pexels/pexelsVideoWidget";
import {
  ProductPicker,
  productWidget,
} from "../easyblocks/externalData/product/productWidget";
import { UrlWidget } from "../easyblocks/types/UrlWidget";

const myCustomFetch = createMyCustomFetch(easyblocksConfig.accessToken);

export default function EeasyblocksEditorPage() {
  const [externalData, setExternalData] = useState<ExternalData>({});

  return (
    <EasyblocksEditor
      config={easyblocksConfig}
      externalData={externalData}
      onExternalDataChange={async (externals) => {
        const fetchedExternalData = await myCustomFetch(externals);
        const removedExternals = Object.entries(externals)
          .filter(
            ([id, externalDataValue]) =>
              externalDataValue.id === null && externalData[id]
          )
          .map(([externalId]) => externalId);

        const newExternalData: ExternalData = {
          ...externalData,
          ...fetchedExternalData,
        };

        for (const removedExternalId of removedExternals) {
          delete newExternalData[removedExternalId];
        }

        setExternalData(newExternalData);
      }}
      components={components}
      widgets={{
        [mockImageWidget.id]: MockImagePicker,
        [mockVideoWidget.id]: MockVideoPicker,
        [productWidget.id]: ProductPicker,
        [pexelsImageWidget.id]: PexelsImagePicker,
        [pexelsVideoWidget.id]: PexelsVideoPicker,
        url: UrlWidget,
      }}
    />
  );
}
