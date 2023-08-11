// @ts-check
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { rawPlugin, reactGlobals } from "@easyblocks/build-tools";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

const componentBuilderBundleConfig = createBuilderBundleConfig({
  input: "./src/builders/react/ComponentBuilder/ComponentBuilder",
  outputFile: "./src/built/builders/react/ComponentBuilder.js",
});

const editableComponentBuilderEditorBundleConfig = createBuilderBundleConfig({
  input:
    "./src/builders/react/EditableComponentBuilder/EditableComponentBuilder",
  outputFile: "./src/built/builders/react/EditableComponentBuilder.editor.js",
});

const editableComponentBuilderClientBundleConfig = createBuilderBundleConfig({
  input:
    "./src/builders/react/EditableComponentBuilder/EditableComponentBuilder.client",
  outputFile: "./src/built/builders/react/EditableComponentBuilder.client.js",
});

const placeholderBuilderEditorBundleConfig = createBuilderBundleConfig({
  input: "./src/builders/react/Placeholder",
  outputFile: "./src/built/builders/react/Placeholder.editor.js",
});

const placeholderBuilderClientBundleConfig = createBuilderBundleConfig({
  input: "./src//builders/react/Placeholder.client",
  outputFile: "./src/built/builders/react/Placeholder.client.js",
});

const missingComponentBuilderBundleConfig = createBuilderBundleConfig({
  input: "./src/builders/react/MissingComponent",
  outputFile: "./src/built/builders/react/MissingComponent.js",
});

const canvasRootBundleConfig = createBuilderBundleConfig({
  input: "./src/builders/react/CanvasRoot/CanvasRoot",
  outputFile: "./src/built/builders/react/CanvasRoot.js",
});

const boxBundleConfig = createBuilderBundleConfig({
  input: "./src/builders/react/Box/Box",
  outputFile: "./src/built/builders/react/Box.js",
});

export default [
  componentBuilderBundleConfig,
  editableComponentBuilderEditorBundleConfig,
  editableComponentBuilderClientBundleConfig,
  placeholderBuilderEditorBundleConfig,
  placeholderBuilderClientBundleConfig,
  missingComponentBuilderBundleConfig,
  canvasRootBundleConfig,
  boxBundleConfig,
];

function createBuilderBundleConfig({ input, outputFile }) {
  const inputFileName = path.basename(input);

  /**
   * @type import('rollup').RollupOptions
   */
  const config = {
    input,
    output: {
      format: "iife",
      file: outputFile,
      plugins: [rawPlugin()],
      globals: reactGlobals(),
    },
    plugins: [
      babel({
        configFile: "./.babelrc.json",
        exclude: /node_modules/,
        extensions: [".tsx", ".ts", ".js"],
        babelHelpers: "bundled",
      }),

      commonjs(),

      nodeResolve({
        extensions: [".tsx", ".ts", ".js"],
        browser: true,
      }),

      visualizer({
        filename: `./src/built/stats/${inputFileName}/index.html`,
        gzipSize: true,
      }),
    ],
    external: ["react", "react-dom"],
  };

  return config;
}
