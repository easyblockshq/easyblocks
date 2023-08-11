import React, { ReactNode, useEffect, useState } from "react";
import { useForceRerender } from "./hooks/useForceRerender";
import { Shopstory } from "./Shopstory";
import {
  ShopstoryMetadataProvider,
  useShopstoryMetadata,
} from "./ShopstoryMetadataProvider";

export const EditorChildWindow = () => {
  const { meta, compiled } = window.parent.editorWindowAPI;

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

  const shouldNotRender = !enabled || !meta || !compiled;

  if (shouldNotRender) {
    return <div>Loading...</div>;
  }

  return (
    // ShopstoryMetadataProvider must be defined in case of nested <Shopstory /> components are used!
    <ShopstoryMetadataProvider meta={meta}>
      <ShopstoryCanvas>
        <Shopstory content={{ renderableContent: compiled }} />
      </ShopstoryCanvas>
    </ShopstoryMetadataProvider>
  );
};

function ShopstoryCanvas(props: { children: ReactNode }) {
  const meta = useShopstoryMetadata();
  const CanvasRoot = meta.code.CanvasRoot;
  return <CanvasRoot>{props.children}</CanvasRoot>;
}
