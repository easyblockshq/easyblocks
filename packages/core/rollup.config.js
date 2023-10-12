// @ts-check
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { getFullySpecifiedEnvs } from "@easyblocks/build-tools";
import path from "node:path";
import visualizer from "rollup-plugin-visualizer";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const getPlugins = (stat, isFullBundle = false) => {
  /**
   * @type {Array<import('rollup').Plugin>}
   */

  const plugins = [
    replace({
      values: getFullySpecifiedEnvs(),
      preventAssignment: true,
    }),

    babel({
      configFile: "./.babelrc.json",
      extensions,
      exclude: [/(node_modules|(editor|compiler)\/dist)/],
      babelHelpers: "runtime",
    }),
    nodeResolve({
      extensions,
      browser: isFullBundle, // browser: true for bundled editor, it's important not to add "node" stuff to the editor that is run in the browser
    }),

    commonjs(),
    json(),

    visualizer({
      filename: stat,
      gzipSize: true,
    }),

    {
      name: "preserve-api-script-module-import",
      renderDynamicImport: (options) => {
        if (options.moduleId.endsWith("loadScripts.ts")) {
          return {
            left: "import(",
            right: ")",
          };
        }

        return;
      },
    },
  ];

  // if (process.env.NODE_ENV === "production") {
  //     plugins.push(terser());
  // }

  return plugins;
};

// Get all external dependencies from package.json
const absolutePath = process.cwd();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(path.join(absolutePath, "package.json"));
const dependencyKeys = Object.keys(packageJson.dependencies || {});
const peerDependencyKeys = Object.keys(packageJson.peerDependencies || {});

const allDependenciesKeys = [
  ...dependencyKeys,
  ...peerDependencyKeys,
  /@babel\/runtime/,
  /^lodash\//,
];

function createRollupConfigs({
  inputFile,
  baseOutputDir,
  baseStatOutputDir,
  isFullBundle = false,
}) {
  const banner = "/* with love from shopstory */";
  const external = isFullBundle ? [] : allDependenciesKeys;

  /** @type import('rollup').RollupOptions */
  const esBundleConfig = {
    input: inputFile,
    output: {
      format: "es",
      dir: `${baseOutputDir}/es`,
      banner,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: getPlugins(
      path.join(baseStatOutputDir, "es/index.html"),
      isFullBundle
    ),
    external,
  };

  /** @type import('rollup').RollupOptions */
  const cjsBundleConfig = {
    input: inputFile,
    output: {
      format: "cjs",
      dir: baseOutputDir,
      strict: false, // contentful-extension-sdk has a bug when strict mode is used
      banner,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: getPlugins(
      path.join(baseStatOutputDir, "cjs/index.html"),
      isFullBundle
    ),
    external,
  };

  return [esBundleConfig, cjsBundleConfig];
}

export default createRollupConfigs({
  inputFile: "src/index.ts",
  baseOutputDir: "dist",
  baseStatOutputDir: "stats",
});
