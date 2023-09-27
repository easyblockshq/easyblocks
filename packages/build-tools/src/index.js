// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");
const path = require("node:path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const {
  internalDependenciesValidator,
} = require("./internalDependenciesValidator");
const { rawPlugin, reactGlobals } = require("./rollup");
const { nodeExternals } = require("./webpack");

const NODE_ENV =
  process.env.NODE_ENV === "development" ? "development" : "production";
const isProduction = NODE_ENV === "production";
const isDevelopment = NODE_ENV === "development";

/**
 * To generate typings during the Webpack's build we run `ts-loader` in "emit only declarations" mode.
 * This means that `ts-loader` doesn't output any transformed code which is treated as error by `ts-loader` itself.
 * This plugin suppress this error.
 */
class SuppressTSLoaderNoEmitErrorPlugin {
  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.shouldEmit.tap(
      "SuppressTSLoaderNoEmitErrorPlugin",
      (compilation) => {
        compilation.errors = compilation.errors.filter((error) => {
          console.log(error.toString());
          return !error.toString().includes("TypeScript emitted no output for");
        });

        return true;
      }
    );
  }
}

const { parsed } = dotenv.config({
  path: path.join(__dirname, `../../../.env.${NODE_ENV}`),
});

/** @type {Record<string, string | undefined>} */
const envs = {
  ...process.env,
  NODE_ENV,
  ...parsed,
  EASYBLOCKS_API_URL: process.env.EASYBLOCKS_API_URL ?? "http://localhost:3100",
  VERCEL: process.env.VERCEL ?? 0,
};

function getFullySpecifiedEnvs() {
  const fullySpecifiedEnvs = Object.fromEntries(
    Object.entries(envs).map(([envName, envValue]) => {
      return [`process.env.${envName}`, JSON.stringify(envValue)];
    })
  );

  return fullySpecifiedEnvs;
}

function DefineShopstoryEnvironmentVariablesPlugin() {
  const fullySpecifiedEnvs = getFullySpecifiedEnvs();
  return new webpack.DefinePlugin(fullySpecifiedEnvs);
}

/**
 *
 * @param {import('webpack').Configuration} config
 * @returns {import('webpack').Configuration}
 */
function withBundleAnalyze(config) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(new BundleAnalyzerPlugin());

  return config;
}

module.exports = {
  isProduction,
  isDevelopment,
  envs,
  SuppressTSLoaderNoEmitErrorPlugin,
  DefineShopstoryEnvironmentVariablesPlugin,
  getFullySpecifiedEnvs,
  withBundleAnalyze,
  internalDependenciesValidator,
  rawPlugin,
  nodeExternals,
  reactGlobals,
};
