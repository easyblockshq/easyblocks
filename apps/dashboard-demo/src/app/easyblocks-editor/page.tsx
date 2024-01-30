"use client";

import { RequestedExternalData, ExternalData } from "@easyblocks/core";
import { EasyblocksEditor } from "@easyblocks/editor";
import { useEffect, useRef, useState } from "react";
import { easyblocksComponents } from "../easyblocks/components";
import { easyblocksConfig } from "../easyblocks/easyblocks.config";
import { fetchExternalData } from "../easyblocks/fetchExternalData";
import { AssetPicker } from "../easyblocks/types/asset/AssetPicker";

export default function EasyblocksEditorPage() {
  const externalDataReferences = useRef<RequestedExternalData>({});
  const [externalDataValues, setExternalDataValues] = useState<ExternalData>(
    {}
  );

  const updateExternalData = async () => {
    setExternalDataValues(
      await fetchExternalData(externalDataReferences.current)
    );
  };

  return (
    <EasyblocksEditor
      config={easyblocksConfig}
      externalData={externalDataValues}
      onExternalDataChange={async (changedExternalData) => {
        // This function is called each time user requests a new external in the editor
        // We're updating external data references to keep track of what data is requested
        externalDataReferences.current = {
          ...externalDataReferences.current,
          ...changedExternalData,
        };

        updateExternalData();
      }}
      components={easyblocksComponents}
      widgets={{
        asset: AssetPicker,
      }}
    />
  );
}
