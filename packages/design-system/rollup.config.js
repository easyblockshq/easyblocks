// @ts-check
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { isDevelopment } from "@easyblocks/build-tools";
import packageJson from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

/**
 * @type import('rollup').RollupOptions
 */
const config = {
  input: "./src/index.ts",
  output: {
    format: "esm",
    file: "dist/index.esm.js",
  },
  external: [
    ...Object.keys(packageJson.peerDependencies),
    ...Object.keys(packageJson.dependencies),
    /@babel\/runtime/,
  ],
  plugins: [
    babel({
      configFile: "./.babelrc.json",
      extensions,
      exclude: [/node_modules/],
      babelHelpers: "runtime",
      sourceMaps: isDevelopment,
    }),

    nodeResolve({
      extensions,
      browser: true,
    }),

    commonjs(),
  ],
};

export default config;
