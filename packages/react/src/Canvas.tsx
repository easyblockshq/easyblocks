import { Config, getLauncherPlugin, LauncherPlugin } from "@easyblocks/core";
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
          const launcherPlugin = getLauncherPlugin(config);

          if (launcherPlugin) {
            launcherPlugin.launcher.onEditorLoad((propsFromLauncher) => {
              return editorModule.launchEditor({
                ...propsFromLauncher,
                config,
              });
            });
          } else {
            editorModule.launchEditor({
              config,
            });
          }
        }
      );
    } else if (selectedWindow === "preview") {
      buildConfig(props.config, true).then((config) => setConfig(config));
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

async function buildConfig(config: Config, isPreview = false) {
  const { noCMSPlugin, noCMSLauncherPlugin, noCMSLauncherPluginPlayground } =
    await import("@easyblocks/nocms");

  const { accessToken, mode } = parseQueryParams();
  const configPlugins = config.plugins ?? [];

  const launcherPlugins = configPlugins.filter<LauncherPlugin>(
    (plugin): plugin is LauncherPlugin => !!plugin.launcher
  );

  const restOfPlugins = configPlugins.filter((plugin) => !plugin.launcher);
  const accessTokenValue =
    mode === "app" ? accessToken ?? config.accessToken : undefined;

  if (launcherPlugins.length > 0) {
    let launcherPlugin: LauncherPlugin;

    if (mode === "app") {
      if (launcherPlugins.length > 1) {
        throw new Error(
          `It seems you have more than 1 launcher plugin in your Shopstory Config.`
        );
      } else {
        launcherPlugin = launcherPlugins[0];

        if (!isPreview && launcherPlugin.launcher.canLoad) {
          const canLoad = launcherPlugin.launcher.canLoad();

          if (!canLoad) {
            launcherPlugin = noCMSLauncherPlugin;
          }
        }

        // Rarely needed but sometimes things must load super fast before any loading takes place
        launcherPlugin?.launcher?.onInit?.();
      }
    } else {
      launcherPlugin = noCMSLauncherPluginPlayground;
    }

    return {
      ...config,
      accessToken: accessTokenValue,
      plugins: config.plugins ?? [noCMSPlugin],
    };
  }

  return {
    ...config,
    accessToken: accessTokenValue,
    plugins: restOfPlugins.length === 0 ? [noCMSPlugin] : restOfPlugins,
  };
}

async function loadEditorModule() {
  const { loadScript } = await import("@easyblocks/core");

  return loadScript("editor.js");
}
