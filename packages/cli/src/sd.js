const gulp = require("gulp");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack-stream");

module.exports = function (targetFolder) {
  return gulp
    .src(["./packages/core/src/sd.ts"])
    .pipe(webpack(getConfiguration()))
    .on("error", function (err) {
      console.error("Webpack compilation error:", err.message);
      this.emit("end");
    })
    .pipe(gulp.dest(targetFolder));
};

function getConfiguration() {
  const isDevelopment = global["d"] || false;
  const isWatch = global["w"] || false;
  const mode = isDevelopment ? "development" : "production";
  const plugins = [];

  return {
    mode,
    watch: isWatch,
    plugins,
    output: {
      filename: "sd.js",
      library: "sd",
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: "this",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                allowJs: true,
                jsx: "react",
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                target: "ES6",
                module: "ESNext",
                moduleResolution: "Node",
                resolveJsonModule: true,
                sourceMap: isDevelopment,
                strict: false,
                skipLibCheck: true,
                allowDeclareFields: true,
              },
              transpileOnly: true,
              experimentalFileCaching: true,
              happyPackMode: false,
            },
          },
        },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
      ],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
            compress: {
              drop_console: !isDevelopment,
              drop_debugger: !isDevelopment,
            },
          },
          parallel: true,
          extractComments: false,
        }),
      ],
    },
    cache: {
      type: "filesystem",
      buildDependencies: { config: [__filename] },
    },
    resolve: {
      alias: { "@": path.resolve(global["projectRoot"], "packages/core/src") },
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      symlinks: false,
    },
    externals: { dagre: "dagre" },
    stats: isDevelopment ? "minimal" : "normal",
  };
}
