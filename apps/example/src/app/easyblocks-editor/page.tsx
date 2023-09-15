"use client";

import { EasyblocksEditor } from "@easyblocks/react";
import { easyblocksConfig } from "@/app/easyblocks/easyblocks.config";
import { AcmeEasyblocksProvider } from "@/app/easyblocks/AcmeEasyblocksProvider";
import { fetchEasyblocksMediaResources } from "@easyblocks/media";
import { fetchPexelsResources } from "../easyblocks/resources/pexels";
import { fetchProductResources } from "../easyblocks/resources/product";
import { useState } from "react";
import { FetchOutputResources } from "@easyblocks/core";

export default function ShopstoryCanvas() {
  const [externalData, setExternalData] = useState<FetchOutputResources>({});

  return (
    <AcmeEasyblocksProvider>
      <EasyblocksEditor
        config={easyblocksConfig}
        externalData={externalData}
        onExternalDataChange={async (resources) => {
          const [easyblocksResources, pexelsResources, productResources] =
            await Promise.all([
              fetchEasyblocksMediaResources(
                resources,
                easyblocksConfig.accessToken
              ),
              fetchPexelsResources(resources),
              fetchProductResources(resources),
            ]);

          setExternalData({
            ...easyblocksResources,
            ...pexelsResources,
            ...productResources,
          });
        }}
      />
    </AcmeEasyblocksProvider>
  );
}
