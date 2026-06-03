import gulp from "gulp";
import path from "node:path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack-stream";

import { cssRule, tsLoaderRule } from "./webpack-base";

export default function sd(targetFolder: string): NodeJS.ReadWriteStream {
  return gulp
    .src(["./packages/core/src/sd.ts"])
    .pipe(webpack(getConfiguration()))
    .on("error", function (this: NodeJS.EventEmitter, err: Error) {
      console.error("Webpack compilation error:", err.message);
      this.emit("end");
    })
    .pipe(gulp.dest(targetFolder));
}

function getConfiguration() {
  const isDev = global.d ? true : false;
  const isWatch = global.w ? true : false;
  const mode = isDev ? "development" : "production";
  return {
    mode,
    watch: isWatch,
    output: {
      filename: "sd.js",
      library: "sd",
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: "this",
    },
    module: {
      rules: [tsLoaderRule(isDev), cssRule],
    },
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
            compress: {
              drop_console: !isDev,
              drop_debugger: !isDev,
            },
          },
          parallel: true,
          extractComments: false,
        }),
      ],
    },
    cache: {
      type: "filesystem" as const,
      buildDependencies: { config: [import.meta.filename] },
    },
    resolve: {
      alias: { "@": path.resolve(global.projectRoot, "packages/core/src") },
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      symlinks: false,
    },
    externals: { dagre: "dagre" },
    stats: isDev ? "minimal" : "normal",
  };
}
