import type {
  ChangedExternalData,
  Config,
  ContextParams,
  ExternalData,
  InlineTypeWidgetComponentProps,
  WidgetComponentProps,
} from "@easyblocks/core";
import React, { ComponentType, useEffect, useState } from "react";
import { EasyblocksCanvas } from "./EditorChildWindow";
import { PreviewRenderer } from "./PreviewRenderer";
import { EasyblocksParent } from "./EasyblocksParent";
import { parseQueryParams } from "./parseQueryParams";

export type ExternalDataChangeHandler = (
  externalData: ChangedExternalData,
  contextParams: ContextParams
) => void;

export type EasyblocksEditorProps = {
  config: Config;
  externalData: ExternalData;
  onExternalDataChange: ExternalDataChangeHandler;
  components?: Record<string, React.ComponentType<any>>;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
  >;
};

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

  return (
    <>
      {selectedWindow === "parent" && (
        <EasyblocksParent
          config={props.config}
          externalData={props.externalData}
          onExternalDataChange={props.onExternalDataChange}
          widgets={props.widgets}
        />
      )}

      {selectedWindow === "child" && (
        <EasyblocksCanvas components={props.components} />
      )}

      {selectedWindow === "preview" && (
        <PreviewRenderer config={props.config} />
      )}
    </>
  );
}
