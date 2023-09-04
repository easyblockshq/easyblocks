import { Config } from "@easyblocks/core";
import React, { useEffect, useState } from "react";
import { EditorChildWindow } from "./EditorChildWindow";
import { parseQueryParams } from "./parseQueryParams";
import { PreviewRenderer } from "./PreviewRenderer";

export type CanvasProps = {
  config: Config;
};

export function Canvas(props: CanvasProps) {
  const [selectedWindow, setSelectedWindow] = useState<
    "parent" | "child" | "preview" | null
  >(null);
  const [config, setConfig] = useState<Config | undefined>(undefined);

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
      Promise.all([buildConfig(props.config), loadEditorModule()]).then(
        ([config, editorModule]) => {
          editorModule.launchEditor({
            config,
          });
        }
      );
    } else if (selectedWindow === "preview") {
      buildConfig(props.config).then((config) => setConfig(config));
    }
  }, [selectedWindow]);

  return (
    <>
      {selectedWindow === "parent" && <div id="shopstory-main-window" />}
      {selectedWindow === "child" && <EditorChildWindow />}
      {selectedWindow === "preview" && config && (
        <PreviewRenderer config={config} />
      )}
    </>
  );
}

async function buildConfig(config: Config) {
  const { accessToken } = parseQueryParams();
  const accessTokenValue = accessToken ?? config.accessToken;

  return {
    ...config,
    accessToken: accessTokenValue,
  };
}

async function loadEditorModule() {
  const { loadScript } = await import("@easyblocks/core");

  return loadScript("editor.js");
}
