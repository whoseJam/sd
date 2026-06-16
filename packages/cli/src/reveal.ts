import gulp from "gulp";
import path from "node:path";
import webpack from "webpack-stream";

import { resolvePackageDir } from "./utils.js";
import { cssRule, tsLoaderRule } from "./webpack-base.js";

export default function reveal(targetFolder: string): NodeJS.ReadWriteStream {
  return gulp
    .src(path.join(resolvePackageDir("@whosejam/sd-reveal"), "dist/reveal.js"))
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
      filename: "reveal.js",
      library: "MyReveal",
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: "this",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: { loader: "babel-loader" },
        },
        tsLoaderRule(isDev),
        cssRule,
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    cache: true,
  };
}
