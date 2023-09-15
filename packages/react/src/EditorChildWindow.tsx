import React, { useEffect, useState } from "react";
import { useForceRerender } from "./hooks/useForceRerender";
import { Easyblocks } from "./Easyblocks";
import { EasyblocksMetadataProvider } from "./EasyblocksMetadataProvider";
import CanvasRoot from "./CanvasRoot/CanvasRoot";
import { EasyblocksExternalDataProvider } from "./EasyblocksExternalDataProvider";

export function EasyblocksCanvas() {
  const { meta, compiled, externalData } = window.parent.editorWindowAPI;

  const [enabled, setEnabled] = useState(false);
  const { forceRerender } = useForceRerender();

  useEffect(() => {
    if (window.self === window.top) {
      throw new Error("No host");
    } else {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    window.parent.editorWindowAPI.onUpdate = () => {
      // Force re-render when child gets info from parent that data changed
      forceRerender();
    };
  });

  const shouldNotRender = !enabled || !meta || !compiled || !externalData;

  if (shouldNotRender) {
    return <div>Loading...</div>;
  }

  return (
    // EasyblocksMetadataProvider must be defined in case of nested <Easyblocks /> components are used!
    <EasyblocksMetadataProvider meta={meta}>
      <EasyblocksExternalDataProvider externalData={externalData}>
        <CanvasRoot>
          <Easyblocks
            renderableDocument={{
              renderableContent: compiled,
              meta,
            }}
            externalData={externalData}
          />
        </CanvasRoot>
      </EasyblocksExternalDataProvider>
    </EasyblocksMetadataProvider>
  );
}
