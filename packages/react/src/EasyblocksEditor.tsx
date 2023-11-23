"use client";
import type { Config, ExternalData } from "@easyblocks/core";
import React, { useEffect, useState } from "react";
import { EasyblocksCanvas } from "./EditorChildWindow";
import { parseQueryParams } from "./parseQueryParams";
import { PreviewRenderer } from "./PreviewRenderer";
import type { ExternalDataChangeHandler } from "./types";

export type EasyblocksEditorProps = {
  config: Config;
  externalData: ExternalData;
  onExternalDataChange: ExternalDataChangeHandler;
  components?: Record<string, React.ComponentType<any>>;
};

export function EasyblocksEditor(props: EasyblocksEditorProps) {
  const [selectedWindow, setSelectedWindow] = useState<
    "parent" | "child" | "preview" | null
  >(null);
  const [editorModule, setEditorModule] = useState<any>();

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

  useEffect(() => {
    if (selectedWindow === "parent") {
      if (editorModule) {
        editorModule.launchEditor({
          config: props.config,
          externalData: props.externalData,
          onExternalDataChange: props.onExternalDataChange,
        });
        return;
      }

      loadEditorModule().then((editorModule) => {
        setEditorModule(setEditorModule);

        editorModule.launchEditor({
          config: props.config,
          externalData: props.externalData,
          onExternalDataChange: props.onExternalDataChange,
        });
      });
    }
  }, [
    selectedWindow,
    props.externalData,
    props.onExternalDataChange,
    props.config,
  ]);

  return (
    <>
      {selectedWindow === "parent" && <div id="shopstory-main-window" />}
      {selectedWindow === "child" && (
        <EasyblocksCanvas components={props.components} />
      )}
      {selectedWindow === "preview" && (
        <PreviewRenderer config={props.config} />
      )}
    </>
  );
}

async function loadEditorModule() {
  const editorModule = await import("@easyblocks/editor");
  return editorModule;
}
