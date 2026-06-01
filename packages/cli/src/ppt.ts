#!/usr/bin/env bun

import colors from "colors-console";
import gulp from "gulp";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "node:fs";
import path from "node:path";
import w from "webpack";
import webpack from "webpack-stream";

import * as animation from "./animation";
import { parseConfig, parseInput } from "./parser";
import { copyVendorAssets } from "./utils";

interface FileEventListener {
  onAdd: (filePath: string, destFolderPath: string) => void;
  onChange: (filePath: string, destFolderPath: string) => void;
  onUnlink: (filePath: string) => void;
}

const eventListener: Record<string, FileEventListener> = {};

defineEventListener("cpp", {
  onAdd: (filePath) => copyCPPFile(filePath),
  onChange: (filePath) => copyCPPFile(filePath),
  onUnlink: cleanCPPFile,
});
defineEventListener("html|md|txt", {
  onAdd: copyAsset,
  onChange: copyAsset,
  onUnlink: cleanFile,
});
defineEventListener("png|jpg|jpeg", {
  onAdd: copyImage,
  onChange: copyImage,
  onUnlink: cleanFile,
});
defineEventListener("js", {
  onAdd: function (filePath, destFolderPath) {
    gulp.task(filePath, () => animation.task(filePath, destFolderPath));
    gulp.task(filePath)();
  },
  onChange: function () {},
  onUnlink: function () {},
});

export function task(
  source: string,
  targetFolder: string,
): NodeJS.ReadWriteStream {
  const pptFilePath = `${source}/ppt.html`;

  if (!fs.existsSync(pptFilePath)) {
    console.log(
      colors("red", `[Error] Please check if the path ${pptFilePath} exists.`),
    );
    process.exit();
  }

  global.source = source;
  global.targetFolder = targetFolder;

  cleanAllFiles(targetFolder);
  cleanAllEmptyDirectories(targetFolder);
  copyVendorAssets(global.projectRoot, targetFolder);
  walk(source, (p: string) => {
    const suffix = p.split(".").slice(-1)[0];
    if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
      console.log(
        colors(
          "red",
          `[Error] No 'onAdd' handler defined for file with extension ${suffix} at ${p}.`,
        ),
      );
      return;
    }
    eventListener[suffix].onAdd(pathToOriginFile(p), pathToTargetFolder(p));
  });

  if (global.w) {
    const watcher = gulp.watch(`${source}/**`);
    watcher.on("change", function (p: string) {
      p = p.replaceAll("\\", "/");
      const suffix = p.split(".").slice(-1)[0];
      if (!eventListener[suffix] || !eventListener[suffix].onChange) {
        console.log(
          colors(
            "red",
            `[Error] No 'onChange' handler defined for file with extension ${suffix} at ${p}.`,
          ),
        );
        return;
      }
      eventListener[suffix].onChange(
        pathToOriginFile(p),
        pathToTargetFolder(p),
      );
    });
    watcher.on("add", function (p: string) {
      p = p.replaceAll("\\", "/");
      const suffix = p.split(".").slice(-1)[0];
      if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
        console.log(
          colors(
            "red",
            `[Error] No 'onAdd' handler defined for file with extension ${suffix} at ${p}.`,
          ),
        );
        return;
      }
      eventListener[suffix].onAdd(pathToOriginFile(p), pathToTargetFolder(p));
    });
    watcher.on("unlink", function (p: string) {
      p = p.replaceAll("\\", "/");
      const suffix = p.split(".").slice(-1)[0];
      if (!eventListener[suffix] || !eventListener[suffix].onUnlink) {
        console.log(
          colors(
            "red",
            `[Error] No 'onUnlink' handler defined for file with extension ${suffix} at ${p}.`,
          ),
        );
        return;
      }
      eventListener[suffix].onUnlink(pathToTargetFile(p));
    });
  }

  return gulp
    .src(pptFilePath)
    .pipe(webpack(getConfiguration()))
    .pipe(gulp.dest(targetFolder));
}

export function launch(selfLaunch = true): NodeJS.ReadWriteStream | undefined {
  if (!import.meta.main && selfLaunch) return;
  if (import.meta.main) {
    global.projectRoot = path.resolve(import.meta.dirname, "..", "..", "..");
  }
  parseInput();
  const pptOutputPath = global.o || parseConfig("pptOutputPath");
  const source = global.i;
  if (!source) {
    console.log(
      colors("red", "[Error] Please provide the source folder path."),
    );
    console.log(
      colors(
        "cyan",
        "Usage: ppt -i <source folder path> [-o <target folder path>]",
      ),
    );
    process.exit();
  }
  if (!global.sd) copyAsset("./dist/sd.js", pptOutputPath);
  if (!global.reveal) copyAsset("./dist/myreveal.js", pptOutputPath);
  return task(source, pptOutputPath);
}

function relativePath(filePath: string): string {
  const A = filePath.split("/");
  const B = global.source.split("/");
  let indexA = 0;
  let indexB = 0;
  while (indexA < A.length && A[indexA] === ".") indexA++;
  while (indexB < B.length && B[indexB] === ".") indexB++;
  while (indexA < A.length && indexB < B.length) {
    if (A[indexA] !== B[indexB]) break;
    indexA++;
    indexB++;
  }
  return A.slice(indexA, A.length).join("/");
}

function relativePathWithoutFile(filePath: string): string {
  const p = relativePath(filePath);
  return p.split("/").slice(0, -1).join("/");
}

function pathToOriginFile(p: string): string {
  return `${global.source}/${relativePath(p)}`;
}

function pathToTargetFile(p: string): string {
  return `${global.targetFolder}/${relativePath(p)}`;
}

function pathToTargetFolder(p: string): string {
  return `${global.targetFolder}/${relativePathWithoutFile(p)}`;
}

function copyAsset(
  srcPath: string,
  destFolderPath: string,
): NodeJS.ReadWriteStream {
  return gulp.src(srcPath).pipe(gulp.dest(destFolderPath));
}

function copyCPPFile(srcPath: string): NodeJS.ReadWriteStream {
  return copyAsset(srcPath, `${global.targetFolder}/std`);
}

function copyImage(
  srcPath: string,
  destFolderPath: string,
): NodeJS.ReadWriteStream {
  return gulp.src(srcPath, { encoding: false }).pipe(gulp.dest(destFolderPath));
}

function cleanFile(p: string): void {
  const stats = fs.statSync(p);
  if (stats.isFile()) fs.unlinkSync(p);
}

function cleanCPPFile(p: string): void {
  const fileName = p.split("/").slice(-1)[0];
  cleanFile(`${global.targetFolder}/std/${fileName}`);
}

function cleanAllFiles(p: string): void {
  if (!fs.existsSync(p)) return;
  const files = fs.readdirSync(p);
  for (const file of files) {
    const filePath = `${p}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) cleanAllFiles(filePath);
    else fs.unlinkSync(filePath);
  }
}

function cleanAllEmptyDirectories(p: string, level = 0): void {
  if (!fs.existsSync(p)) return;
  const files = fs.readdirSync(p);
  if (files.length > 0) {
    let tempFile = 0;
    for (const file of files) {
      tempFile++;
      cleanAllEmptyDirectories(`${p}/${file}`, 1);
    }
    if (tempFile === files.length && level !== 0) fs.rmdirSync(p);
  } else if (level !== 0) {
    fs.rmdirSync(p);
  }
}

function walk(
  directoryPath: string,
  callback: (filePath: string) => void,
): void {
  const files = fs.readdirSync(directoryPath);
  for (const file of files) {
    const filePath = `${directoryPath}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isFile()) callback(filePath);
    else if (stats.isDirectory()) walk(filePath, callback);
  }
}

function defineEventListener(
  suffix: string,
  listener: FileEventListener,
): void {
  for (const s of suffix.split("|")) {
    eventListener[s] = listener;
  }
}

function getConfiguration() {
  const mode = global.d ? "development" : "production";
  const watch = global.w ? true : false;
  // Asset base URL: a remote deploy passes -d https://your-domain; otherwise the
  // output is self-contained and loads everything from "./vendor/..." next to the
  // HTML. There is no implicit CDN fallback.
  const base = global.domain !== undefined ? global.domain : ".";
  const plugins = [
    new HtmlWebpackPlugin({
      template: `${global.projectRoot}/packages/cli/src/pptIndex.html`,
      inject: "body",
      inlineSource: ".(js)$",
      minify: false,
      scriptLoading: "blocking",
      templateParameters: { base },
    }),
    new w.DefinePlugin({
      __VERSION__: JSON.stringify("1.0.0"),
      DOMAIN: JSON.stringify(base),
    }),
  ];
  return {
    mode,
    watch,
    plugins,
    entry: `${global.projectRoot}/packages/cli/src/pptMain.js`,
    module: {
      rules: [
        {
          test: /\.js$/,
          use: { loader: "babel-loader" },
        },
        {
          test: /\.ts$/,
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
              },
              transpileOnly: true,
            },
          },
        },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    performance: {
      hints: false,
    },
    cache: true,
  };
}

if (import.meta.main) launch(true);
