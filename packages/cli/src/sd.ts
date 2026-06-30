import gulp from "gulp";
import path from "node:path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack-stream";

import { resolvePackageDir } from "./utils.js";
import { cssRule, tsLoaderRule } from "./webpack-base.js";

export default function sd(targetFolder: string): NodeJS.ReadWriteStream {
  // Bundle through @whosejam/sd (re-exports sd-core + sd-layout.layout) so the
  // UMD `window.sd` global exposes `layout()` alongside the core API. Animations
  // declare `externals: { "@/sd": "sd", "@whosejam/sd": "sd" }` (see animation.ts)
  // and resolve `sd.layout()` against this UMD bundle at runtime.
  const sdDir = resolvePackageDir("@whosejam/sd");
  return gulp
    .src([path.join(sdDir, "dist/index.js")])
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
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      symlinks: false,
    },
    externals: { dagre: "dagre" },
    stats: isDev ? "minimal" : "normal",
  };
}
