// @ts-check
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import {
  getFullySpecifiedEnvs,
  isDevelopment,
  isProduction,
} from "@easyblocks/build-tools";
import visualizer from "rollup-plugin-visualizer";
import packageJson from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

function getPlugins(format) {
  /**
   * @type import('rollup').RollupOptions['plugins']
   */
  const plugins = [
    replace({
      values: getFullySpecifiedEnvs(),
      preventAssignment: true,
    }),

    babel({
      configFile: "./.babelrc.json",
      extensions,
      exclude: [/node_modules/],
      babelHelpers: "runtime",
    }),

    nodeResolve({
      extensions,
      browser: format === "es",
    }),

    commonjs({}),

    json(),
  ];

  if (isProduction) {
    plugins.push(
      visualizer({
        filename: format === "es" ? "stats/index.html" : "stats/cjs/index.html",
        gzipSize: true,
      })
    );
  }

  return plugins;
}

/**
 * @type import('rollup').RollupOptions
 */
const baseConfig = {
  input: "./src/index.ts",
  external: [
    ...Object.keys(packageJson.peerDependencies),
    ...Object.keys(packageJson.dependencies),
    /crypto-js/,
    /@babel\/runtime/,
    /lodash/,
    /react-dom/,
    /@easyblocks\/core/,
  ],
};

/**
 * @type import('rollup').RollupOptions
 */
const configEs = {
  ...baseConfig,
  output: {
    sourcemap: isDevelopment,
    format: "es",
    dir: "./dist/es",
    banner: `"use client";`,
  },
  plugins: getPlugins("es"),
};

/**
 * @type import('rollup').RollupOptions
 */
const configCjs = {
  ...baseConfig,
  output: {
    sourcemap: isDevelopment,
    format: "cjs",
    dir: "./dist/cjs",
    banner: `"use client";`,
  },
  plugins: getPlugins("cjs"),
};

export default [configEs, configCjs];
