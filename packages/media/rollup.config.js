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
import packageJson from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

internalDependenciesValidator();

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
      sourceMaps: isDevelopment,
    }),

    nodeResolve({
      extensions,
      browser: format === "es",
    }),

    commonjs(),
    json(),
  ];

  if (isProduction) {
    plugins.push(
      visualizer({
        filename:
          format === "es" ? "stats/index.es.html" : "stats/index.cjs.html",
        gzipSize: true,
      })
    );
  }

  return plugins;
}

/**
 * @type import('rollup').RollupOptions
 *
 */
const baseConfig = {
  input: ["./src/index.ts", "./src/index.react-server.ts"],
  external: [
    ...Object.keys(packageJson.peerDependencies),
    ...Object.keys(packageJson.dependencies),
    /crypto-js/,
    /@babel\/runtime/,
    /lodash/,
    /@radix-ui/,
  ],
  onwarn: (warning, warn) => {
    // We're using eval on purpose, so let's ignore this warning.
    if (warning.code === "EVAL") {
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
  },
  plugins: getPlugins("cjs"),
};

export default [configEs, configCjs];
