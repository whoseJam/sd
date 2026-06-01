const gulp = require("gulp");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack-stream");

module.exports = function (targetFolder) {
  return gulp
    .src(["./packages/element/src/SDElement.ts"])
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
  return {
    mode,
    watch: isWatch,
    output: {
      filename: "sd-element.js",
      // IIFE so a plain <script src="sd-element.js"> registers <sd-animation>
      // without the host page needing module support.
      iife: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                allowJs: true,
                target: "ES6",
                module: "ESNext",
                moduleResolution: "Node",
                strict: false,
                skipLibCheck: true,
                sourceMap: isDevelopment,
              },
              transpileOnly: true,
            },
          },
        },
      ],
    },
    performance: { hints: false },
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            compress: { drop_console: !isDevelopment },
          },
          parallel: true,
          extractComments: false,
        }),
      ],
    },
    cache: { type: "filesystem", buildDependencies: { config: [__filename] } },
    resolve: { extensions: [".ts", ".js"] },
    stats: isDevelopment ? "minimal" : "normal",
  };
}
