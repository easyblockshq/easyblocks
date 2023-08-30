// @ts-check
const {
  isDevelopment,
  DefineShopstoryEnvironmentVariablesPlugin,
  isProduction,
} = require("@easyblocks/build-tools");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("node:path");
const babelConfiguration = require("../../babel.config.json");

const localNodeModulesDirPath = path.resolve(__dirname, "node_modules");

/**
 * @type import('webpack').Configuration['plugins']
 */
const plugins = [DefineShopstoryEnvironmentVariablesPlugin()];

/**
 *
 * @param {NonNullable<import('webpack').Configuration['plugins']>} plugins
 * @param {string} packageName
 */
function addForkTsCheckerWebpackPlugin(plugins, packageName) {
  if (isProduction) {
    const nextPlugins = [...plugins];
    nextPlugins.push(
      new ForkTsCheckerWebpackPlugin({
        async: false,
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          configFile: path.resolve(
            __dirname,
            "../../packages/",
            packageName,
            "tsconfig.json"
          ),
        },
      })
    );
    return nextPlugins;
  }

  return plugins;
}

/** @type import('webpack').Configuration */
const compilerEsBundle = {
  name: "compiler.es",
  mode: isDevelopment ? "development" : "production",
  context: __dirname,
  entry: "./src/modules/compiler.ts",
  output: {
    filename: "compiler.js",
    path: path.resolve(__dirname, "public"),
    library: {
      type: "module",
    },
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    fallback: {
      fs: false,
      vm: false,
    },
    modules: [localNodeModulesDirPath, "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            ...babelConfiguration,
          },
        },
      },
    ],
  },
  plugins,
  stats: "minimal",
  optimization: {
    minimize: isProduction,
  },
  devtool: "inline-cheap-module-source-map",
  experiments: {
    outputModule: true,
  },
};

/** @type import('webpack').Configuration */
const compilerCjsBundle = {
  name: "compiler.cjs",
  target: "node",
  mode: isDevelopment ? "development" : "production",
  context: __dirname,
  entry: "./src/modules/compiler.ts",
  output: {
    filename: "compiler.cjs.js",
    path: path.resolve(__dirname, "public"),
    library: {
      type: "commonjs2",
    },
    publicPath: "/",
    globalObject: "global",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    modules: [localNodeModulesDirPath, "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            ...babelConfiguration,
            presets: [
              ["@babel/preset-env", { targets: { node: 14 } }],
              ...babelConfiguration.presets.slice(1),
            ],
          },
        },
      },
    ],
  },
  plugins: addForkTsCheckerWebpackPlugin(plugins, "compiler"),
  stats: "minimal",
  optimization: {
    minimize: isProduction,
  },
  devtool: "inline-cheap-module-source-map",
};

/** @type {import('webpack').Configuration} */
const editorEsBundle = {
  name: "editor.es",
  mode: isDevelopment ? "development" : "production",
  context: __dirname,
  entry: "./src/modules/editor.ts",
  output: {
    filename: "editor.js",
    path: path.resolve(__dirname, "public"),
    library: {
      type: "module",
    },
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    fallback: {
      fs: false,
      vm: false,
    },
    modules: [localNodeModulesDirPath, "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            ...babelConfiguration,
          },
        },
      },
    ],
  },
  plugins: addForkTsCheckerWebpackPlugin(plugins, "editor"),
  stats: "minimal",
  optimization: {
    minimize: isProduction,
  },
  experiments: {
    outputModule: true,
  },
};

module.exports = [compilerEsBundle, compilerCjsBundle, editorEsBundle];
