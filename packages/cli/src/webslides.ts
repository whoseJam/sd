import gulp from "gulp";
import webpack from "webpack-stream";

import { cssRule, scssRule, tsLoaderRule } from "./webpack-base";

export default function webslides(
  targetFolder: string,
): NodeJS.ReadWriteStream {
  return gulp
    .src("./packages/webslides/src/main.ts")
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
