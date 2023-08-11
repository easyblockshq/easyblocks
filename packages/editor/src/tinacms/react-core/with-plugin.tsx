import { TinaPlugin as Plugin } from "@easyblocks/app-utils";
import React from "react";
import { usePlugin } from "./use-plugin";

/**
 * A Higher-Order-Component for adding Plugins to the CMS.
 *
 * @param Component A React Component
 * @param plugin Plugin
 * @alias withPlugin
 */
export function withPlugins(Component: any, plugins: Plugin | Plugin[]) {
  return (props: any) => {
    usePlugin(plugins);
    return <Component {...props} />;
  };
}

/**
 * A Higher-Order-Component for adding Plugins to the CMS.
 *
 * @param Component A React Component
 * @param plugin Plugin
 * @alias withPlugins
 */
export const withPlugin = withPlugins;
