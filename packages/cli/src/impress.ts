import gulp from "gulp";
import webpack from "webpack-stream";

import { cssRule, tsLoaderRule } from "./webpack-base";

export default function impress(targetFolder: string): NodeJS.ReadWriteStream {
  return gulp
    .src("./packages/impress/src/main.ts")
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
      filename: "impress.js",
      iife: true,
    },
    module: {
      rules: [tsLoaderRule(isDev), cssRule],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    cache: true,
  };
}
