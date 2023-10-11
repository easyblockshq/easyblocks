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
  reactGlobals,
} from "@easyblocks/build-tools";
import visualizer from "rollup-plugin-visualizer";
import packageJson from "./package.json";

/**
 * @type import('rollup').RollupOptions
 */
const baseConfig = {
  input: {
    index: "src/index.ts",
    "BackgroundColor/BackgroundColor.client":
      "src/components/$backgroundColor/$backgroundColor.client.tsx",
    "Image/Image.client": "src/components/$image/$image.client.tsx",
    "Image/Image.editor": "src/components/$image/$image.editor.tsx",
    "RichText/RichText.client": "src/components/$richText/$richText.client.tsx",
    "RichText/RichText.editor": "src/components/$richText/$richText.editor.tsx",
    "RichText/RichTextBlockElement.client":
      "src/components/$richText/$richTextBlockElement/$richTextBlockElement.client.tsx",
    "RichText/RichTextInlineWrapperElement.client":
      "src/components/$richText/$richTextInlineWrapperElement/$richTextInlineWrapperElement.client.tsx",
    "RichText/RichTextLineElement.client":
      "src/components/$richText/$richTextLineElement/$richTextLineElement.client.tsx",
    "RichText/RichTextPart.client":
      "src/components/$richText/$richTextPart/$richTextPart.client.tsx",
    "Text/Text.client": "src/components/$text/$text.client.tsx",
    "Text/Text.editor": "src/components/$text/$text.editor.tsx",
    "Video/Video.client": "src/components/$video/$video.client.tsx",
    "Video/Video.editor": "src/components/$video/$video.editor.tsx",
    "RootSections/RootSections.client":
      "src/components/$RootSections/$RootSections.client.tsx",
    "RootGrid/RootGrid.client": "src/components/$RootGrid/$RootGrid.client.tsx",
    "BannerCard/BannerCard.client": "src/components/BannerCard/BannerCard.tsx",
    "BannerCard2/BannerCard2.client":
      "src/components/BannerCard2/BannerCard2.tsx",
    "BannerSection/BannerSection.client":
      "src/components/SectionWrapper/SectionWrapper.tsx",
    "BannerSection2/BannerSection2.client":
      "src/components/SectionWrapper/SectionWrapper.tsx",
    "BasicCard/BasicCard.client":
      "src/components/BasicCard/BasicCard.client.tsx",
    "BasicCardBackground/BasicCardBackground.client":
      "src/components/BasicCard/BasicCard.client.tsx",
    "Buttons/Buttons.client": "src/components/$buttons/$buttons.client.tsx",
    "CardPlaceholder/CardPlaceholder.client":
      "src/components/CardPlaceholder/CardPlaceholder.client.tsx",
    "ComponentContainer/ComponentContainer.client":
      "src/components/ComponentContainer/ComponentContainer.client.tsx",
    "Grid/Grid.client": "src/components/SectionWrapper/SectionWrapper.tsx",
    "GridCard/GridCard.client": "src/components/Grid/Grid.tsx",
    "Icon/Icon.client": "src/components/$icon/$icon.client.tsx",
    "IconButton/v1/IconButton.client":
      "src/components/IconButton/v1/IconButton.tsx",
    "IconButton/v2/IconButton.client":
      "src/components/IconButton/v2/IconButton.tsx",
    "Placeholder/Placeholder.client":
      "src/components/Placeholder/Placeholder.tsx",
    "Playground/Playground.client":
      "src/components/Playground/Playground.client.tsx",
    "Separator/Separator.client": "src/components/Separator/Separator.tsx",
    "Stack/Stack.client": "src/components/$stack/$stack.tsx",
    "StandardButton/StandardButton.client":
      "src/components/StandardButton/StandardButton.client.tsx",
    "TokenButton/TokenButton.client": "src/components/Token/Token.tsx",
    "TokenColor/TokenColor.client": "src/components/TokenColor/TokenColor.tsx",
    "TokenFont/TokenFont.client": "src/components/TokenFont/TokenFont.tsx",
    "TwoCards/TwoCards.client":
      "src/components/SectionWrapper/SectionWrapper.tsx",
    "TwoCardsCard/TwoCardsCard.client": "src/components/TwoCards/TwoCards.tsx",
    "TwoItems/TwoItems.client": "src/components/$twoItems/$twoItems.tsx",
    "VimeoPlayer/VimeoPlayer.client":
      "src/components/vimeoPlayer/vimeoPlayer.client.tsx",
    "Zone/Zone.client": "src/components/Zone/Zone.client.tsx",
  },
  external: [
    ...Object.keys(packageJson.dependencies),
    /crypto-js/,
    /@babel\/runtime/,
    /lodash/,
    "react",
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

function getPlugins(format) {
  const extensions = [".js", ".jsx", ".ts", ".tsx"];

  /**
   * @type import('rollup').RollupOptions['plugins']
   */
  const plugins = [
    replace({
      values: getFullySpecifiedEnvs(),
      preventAssignment: true,
    }),

    commonjs(),

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

    json(),

    {
      name: "remove-jsx-pragma-comment",
      transform(code, id) {
        if (id.includes("components")) {
          return {
            code: code.replace(
              /\/\*\* @jsx globalThis\.__SHOPSTORY_REACT_SCOPE__\.createElement \*\/\n/g,
              ""
            ),
            map: null,
          };
        }
      },
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
const configEs = {
  ...baseConfig,
  output: {
    format: "es",
    dir: "./dist/es",
    globals: reactGlobals(),
    exports: "auto",
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
    globals: reactGlobals(),
    exports: "auto",
  },
  plugins: getPlugins("cjs"),
};

export default [configEs, configCjs];
