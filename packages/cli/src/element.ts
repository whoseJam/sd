import gulp from "gulp";
import path from "node:path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack-stream";

import { resolvePackageDir } from "./utils.js";
import { tsLoaderRule } from "./webpack-base.js";

export default function element(targetFolder: string): NodeJS.ReadWriteStream {
  return gulp
    .src([path.join(resolvePackageDir("@whosejam/sd-element"), "src/element.ts")])
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
      filename: "sd-element.js",
      // IIFE so a plain <script src="sd-element.js"> registers <sd-animation>
      // without the host page needing module support.
      iife: true,
    },
    module: {
      rules: [tsLoaderRule(isDev)],
    },
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            compress: { drop_console: !isDev },
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
    resolve: { extensions: [".ts", ".js"] },
    stats: isDev ? "minimal" : "normal",
  };
}
