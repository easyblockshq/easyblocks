/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const { isDevelopment } = require("@easyblocks/build-tools");
const path = require("node:path");
const babelConfiguration = require("./.babelrc.json");
const packageJson = require("./package.json");

/**
 * @type import('webpack').Configuration['plugins']
 */
const plugins = [];

/** @type import('webpack').Configuration */
const config = {
  mode: isDevelopment ? "development" : "production",
  context: __dirname,
  entry: "./src/index",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "commonjs2",
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
  plugins,
  externals: [...Object.keys(packageJson.dependencies), /@babel\/runtime/],
  stats: "minimal",
  optimization: {
    minimize: false,
  },
};

module.exports = config;
