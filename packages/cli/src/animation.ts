#!/usr/bin/env bun

import colors from "colors-console";
import gulp from "gulp";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";
import webpack from "webpack-stream";

import { parseConfig, parseInput } from "./parser";
import { copyFile, copyVendorAssets, validateJSFile } from "./utils";

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
  const config = getConfiguration(file);
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

function getConfiguration(file: string) {
  const mode = "development";
  const watch = global.w ? true : false;
  // Asset base URL: a remote deploy passes -d https://your-domain; otherwise the
  // output is self-contained and loads everything from "./vendor/..." next to the
  // HTML. There is no implicit CDN fallback.
  const base = global.domain !== undefined ? global.domain : ".";
  const plugins = [
    new HtmlWebpackPlugin({
      template: `${global.projectRoot}/packages/cli/src/aniIndex.html`,
      inject: "body",
      inlineSource: ".(js)$",
      minify: false,
      filename: `${file}.html`,
      scriptLoading: "blocking",
      templateParameters: { base },
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
                sourceMap: mode === "development",
                strict: false,
                skipLibCheck: true,
                allowDeclareFields: true,
              },
              transpileOnly: true,
              experimentalFileCaching: true,
            },
          },
        },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
      ],
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
