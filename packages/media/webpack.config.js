/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const {
  isProduction,
  DefineShopstoryEnvironmentVariablesPlugin,
  nodeExternals,
} = require("@easyblocks/build-tools");
const path = require("node:path");
const babelConfiguration = require("./.babelrc.json");

/**
 * @type import('webpack').Configuration
 */
const config = {
  target: "web",
  mode: isProduction ? "production" : "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module",
    },
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              ...babelConfiguration,
            },
          },
        ],
      },
    ],
  },
  plugins: [DefineShopstoryEnvironmentVariablesPlugin()],
  externals: [nodeExternals()],
  stats: "minimal",
  optimization: {
    minimize: false,
  },
  experiments: {
    outputModule: true,
  },
};

module.exports = config;
