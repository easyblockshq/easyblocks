// @ts-check
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import {
  getFullySpecifiedEnvs,
  internalDependenciesValidator,
  isDevelopment,
  isProduction,
} from "@easyblocks/build-tools";
import visualizer from "rollup-plugin-visualizer";
import preserveDirectives from "rollup-plugin-preserve-directives";
import packageJson from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

internalDependenciesValidator();

function getPlugins(format) {
  const preserveDirectivesPlugin = preserveDirectives();

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
      sourceMaps: isDevelopment,
    }),

    nodeResolve({
      extensions,
      browser: format === "es",
    }),

    commonjs(),

    json(),

    {
      ...preserveDirectivesPlugin,
      // @ts-expect-error preserveDirectivesPlugin is incompatible by default with our version or rollup
      renderChunk: preserveDirectivesPlugin.renderChunk.handler,
    },
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
    ...Object.keys(packageJson.dependencies).map(
      (packageName) => new RegExp(packageName)
    ),
    /crypto-js/,
  ],
  onwarn: (warning, warn) => {
    // We're using eval on purpose, so let's ignore this warning.
    if (warning.code === "EVAL") {
      return;
    }

    if (
      warning.message.includes(
        "Module level directives cause errors when bundled, 'use client' was ignored."
      )
    ) {
      return;
    }

    warn(warning);
  },
};

/**
 * @type import('rollup').RollupOptions
 */
const configEs = {
  ...baseConfig,
  output: {
    format: "es",
    dir: "./dist/es",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
  plugins: getPlugins("es"),
};

/**
 * @type import('rollup').RollupOptions
 */
const configCjs = {
  ...baseConfig,
  output: {
    format: "cjs",
    dir: "./dist/cjs",
    preserveModules: true,
    preserveModulesRoot: "src",
    exports: "auto",
  },
  plugins: getPlugins("cjs"),
};

export default [configEs, configCjs];
