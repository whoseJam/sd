import gulp from "gulp";
import path from "node:path";
import webpack from "webpack-stream";

import { resolvePackageDir } from "./utils.js";
import { cssRule, scssRule, tsLoaderRule } from "./webpack-base.js";

export default function webslides(
  targetFolder: string,
): NodeJS.ReadWriteStream {
  return gulp
    .src(path.join(resolvePackageDir("@whosejam/sd-webslides"), "src/main.ts"))
    .pipe(webpack(getConfiguration()))
    .pipe(gulp.dest(targetFolder));
}

function getConfiguration() {
  const isDev = global.d ? true : false;
  const mode = isDev ? "development" : "production";
  const isWatch = global.w ? true : false;
  return {
    mode,
    watch: isWatch,
    output: {
      filename: "webslides.js",
      iife: true,
    },
    module: {
      rules: [tsLoaderRule(isDev), cssRule, scssRule],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    cache: true,
  };
}
