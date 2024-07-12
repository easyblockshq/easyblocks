import React, { useEffect, useState } from "react";
import { EasyblocksEditorProps } from "./EasyblocksEditorProps";
import { EasyblocksParent } from "./EasyblocksParent";
import { EasyblocksCanvas } from "./EditorChildWindow";
import { PreviewRenderer } from "./PreviewRenderer";
import { addDebugToEditorProps } from "./debug/addDebugToEditorProps";
import { parseQueryParams } from "./parseQueryParams";

export function EasyblocksEditor(props: EasyblocksEditorProps) {
  const [selectedWindow, setSelectedWindow] = useState<
    "parent" | "child" | "preview" | null
  >(null);

  const setSelectedWindowToParent = () => {
    window.isShopstoryEditor = true;
    setSelectedWindow("parent");
  };

  useEffect(() => {
    if (parseQueryParams().preview) {
      setSelectedWindow("preview");
      return;
    }

    const setSelectedWindowToChild = () => {
      setSelectedWindow("child");
    };

    if (selectedWindow === null) {
      /**
       * Why try catch?
       *
       * It's because window.parent.isShopstoryEditor might throw if window.parent is cross origin (when shopstory Launcher is run in iframe of CMS - like Contentful); In that case we're sure it's a parent window, not a child.
       */
      try {
        // Parent window is always rendered first so `window.isShopstoryEditor` will always be set when <iframe /> with child is loading
        if (window.parent !== window.self && window.parent.isShopstoryEditor) {
          setSelectedWindowToChild();
        } else {
          setSelectedWindowToParent();
        }
      } catch (error) {
        setSelectedWindowToParent();
      }
    }
  }, []);

  if (!selectedWindow) {
    return null;
  }

  if (parseQueryParams().debug) {
    props = addDebugToEditorProps(props);
  }

  return (
    <>
      {selectedWindow === "parent" && (
        <EasyblocksParent
          config={props.config}
          externalData={props.externalData ?? {}}
          onExternalDataChange={props.onExternalDataChange ?? (() => ({}))}
          widgets={props.widgets}
          components={props.components}
        />
      )}

      {selectedWindow === "child" && (
        <EasyblocksCanvas
          components={props.components}
          renderer={props.renderer}
        />
      )}

      {selectedWindow === "preview" && <PreviewRenderer {...props} />}
    </>
  );
}
