/* eslint-disable @typescript-eslint/no-var-requires */
const webpackNodeExternals = require("webpack-node-externals");

/**
 * Excludes from bundle code of node packages
 * @example
 * ```
 * const { nodeExternals } = require('@easyblocks/build-tools');
 *
 * config = {
 *   externals: [nodeExternals()]
 * }
 * ```
 */
function nodeExternals() {
  return webpackNodeExternals({
    // Since we're in monorepo, `webpack-node-externals` will only lookup for modules within `node_modules` of current working directory
    // thus we've to supply additional location of modules to externalize located in the root of monorepo.
    additionalModuleDirs: ["../../node_modules"],

    // We don't want to exclude from bundle code of our internal packages unless that package has its own build phase.
    allowlist: [/^@shopstory\/(?!(nocms|compiler|editor))/],
  });
}

module.exports = {
  nodeExternals,
};
