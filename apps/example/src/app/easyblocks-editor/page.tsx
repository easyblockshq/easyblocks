"use client";

import { AcmeEasyblocksProvider } from "@/app/easyblocks/AcmeEasyblocksProvider";
import { easyblocksConfig } from "@/app/easyblocks/easyblocks.config";
import { FetchOutputResources } from "@easyblocks/core";
import { EasyblocksEditor } from "@easyblocks/react";
import { useState } from "react";
import { createMyCustomFetch } from "../easyblocks/myCustomFetch";

export default function EeasyblocksEditorPage() {
  const [externalData, setExternalData] = useState<FetchOutputResources>({});

  const myCustomFetch = createMyCustomFetch(easyblocksConfig.accessToken);

  return (
    <AcmeEasyblocksProvider>
      <EasyblocksEditor
        config={easyblocksConfig}
        externalData={externalData}
        onExternalDataChange={async (resources) => {
          const fetchedExternalData = await myCustomFetch(resources);

          setExternalData({
            ...externalData,
            ...fetchedExternalData,
          });
        }}
      />
    </AcmeEasyblocksProvider>
  );
}
