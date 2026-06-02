#!/usr/bin/env bun

import colors from "colors-console";
import gulp from "gulp";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";
import webpack from "webpack-stream";

import { parseConfig, parseConfigFonts, parseInput } from "./parser";
import { copyFile, copyVendorAssets, validateJSFile } from "./utils";
import { cssRule, tsLoaderRule } from "./webpack-base";

function truncateAtStackTrace(errorMessage: string): string {
  const index = errorMessage.indexOf("    at");
  return index !== -1 ? errorMessage.substring(0, index) : errorMessage;
}

export function task(
  source: string,
  targetFolder: string,
): NodeJS.ReadWriteStream {
  source = source.replaceAll("\\", "/");
  validateJSFile(source);
  const file = String(source).split("/").slice(-1)[0].split(".")[0];
  const config = getConfiguration(file, targetFolder);
  return gulp
    .src(source)
    .pipe(webpack(config))
    .on("error", function (this: NodeJS.EventEmitter, error: Error) {
      if (global.s) {
        console.error(truncateAtStackTrace(error.message));
        process.exit(1);
      }
    })
    .pipe(gulp.dest(targetFolder));
}

export function launch(selfLaunch = true): NodeJS.ReadWriteStream | undefined {
  if (!import.meta.main && selfLaunch) return;
  if (import.meta.main) {
    global.projectRoot = path.resolve(import.meta.dirname, "..", "..", "..");
  }
  parseInput();
  const animationOutputPath = global.o || parseConfig("animationOutputPath");
  const sourceFilePath = global.i;
  if (!sourceFilePath) {
    console.log(colors("red", "[Error] Please provide the source file path."));
    console.log(
      colors(
        "cyan",
        "Usage: animation -i <source file path> [-o <target path>]",
      ),
    );
    process.exit();
  }
  if (!global.sd && !global.s) {
    copyFile("./dist/sd.js", animationOutputPath);
    copyVendorAssets(global.projectRoot, animationOutputPath);
  }
  return task(sourceFilePath, animationOutputPath);
}

function getConfiguration(file: string, targetFolder: string) {
  const isDev = global.d ? true : false;
  const mode = isDev ? "development" : "production";
  const watch = global.w ? true : false;
  // Asset base URL. Priority:
  //   1. -d <domain> — remote deploy, base is the absolute URL
  //   2. animation is bundled inside a deck — base walks up from the
  //      animation's subfolder to the deck root so the iframe-loaded HTML
  //      resolves `./sd.js` / `./vendor/...` against deck root, not its own dir
  //   3. standalone build — base is "." (self-contained alongside HTML)
  const base =
    global.domain !== undefined
      ? global.domain
      : global.targetFolder && targetFolder !== global.targetFolder
        ? path
            .relative(targetFolder, global.targetFolder)
            .replaceAll("\\", "/") || "."
        : ".";
  const plugins = [
    new HtmlWebpackPlugin({
      template: `${global.projectRoot}/packages/cli/src/aniIndex.html`,
      inject: "body",
      inlineSource: ".(js)$",
      minify: false,
      filename: `${file}.html`,
      scriptLoading: "blocking",
      templateParameters: { base, fonts: parseConfigFonts().join(",") },
    }),
  ];
  return {
    mode,
    watch,
    output: {
      filename: `${file}.js`,
    },
    plugins,
    module: {
      rules: [tsLoaderRule(isDev), cssRule],
    },
    performance: {
      hints: false,
    },
    cache: true,
    resolve: {
      alias: {
        "@": path.resolve(global.projectRoot, "packages/core/src"),
      },
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    externals: {
      "@/sd": "sd",
      slidew: "sd",
    },
  };
}

if (import.meta.main) launch(true);
