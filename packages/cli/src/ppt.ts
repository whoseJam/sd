#!/usr/bin/env bun

import colors from "colors-console";
import gulp from "gulp";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import w from "webpack";
import webpack from "webpack-stream";

import * as animation from "./animation";
import { parseConfig, parseInput } from "./parser";
import { toOriginFile, toTargetFile, toTargetFolder, walk } from "./path-utils";
import theme from "./theme";
import { copyVendorAssets } from "./utils";
import { cssRule, scssRule, tsLoaderRule } from "./webpack-base";

const require = createRequire(import.meta.url);

const VALID_FRAMEWORKS = ["reveal", "impress", "webslides"];

interface PptHost {
  template: string;
  entry: string;
  libraryBundle?: string;
}

function getHost(): PptHost {
  const framework = global.framework ?? "reveal";
  if (!VALID_FRAMEWORKS.includes(framework)) {
    console.log(
      colors(
        "red",
        `[Error] Unknown framework '${framework}'. Valid: ${VALID_FRAMEWORKS.join(", ")}`,
      ),
    );
    process.exit(1);
  }
  return require(`@sd/${framework}/host.ts`) as PptHost;
}

interface FileEventListener {
  onAdd: (filePath: string, destFolderPath: string) => void;
  onChange: (filePath: string, destFolderPath: string) => void;
  onUnlink: (filePath: string) => void;
}

const eventListener: Record<string, FileEventListener> = {};

eventListener["cpp"] = {
  onAdd: (filePath) => copyCPPFile(filePath),
  onChange: (filePath) => copyCPPFile(filePath),
  onUnlink: cleanCPPFile,
};

for (const s of ["html", "md", "txt"]) {
  eventListener[s] = {
    onAdd: copyAsset,
    onChange: copyAsset,
    onUnlink: cleanFile,
  };
}

for (const s of ["png", "jpg", "jpeg"]) {
  eventListener[s] = {
    onAdd: copyImage,
    onChange: copyImage,
    onUnlink: cleanFile,
  };
}

const onAddAnimation = (filePath: string, destFolderPath: string) => {
  gulp.task(filePath, () => animation.task(filePath, destFolderPath));
  gulp.task(filePath)();
};

eventListener["js"] = {
  onAdd: onAddAnimation,
  onChange: () => {},
  onUnlink: () => {},
};
eventListener["ts"] = {
  onAdd: onAddAnimation,
  onChange: () => {},
  onUnlink: () => {},
};

export function task(
  source: string,
  targetFolder: string,
): NodeJS.ReadWriteStream {
  const entry = global.entry || ".";
  const pptFilePath =
    entry === "." ? `${source}/ppt.html` : `${source}/${entry}/ppt.html`;

  if (!fs.existsSync(pptFilePath)) {
    console.log(
      colors("red", `[Error] Please check if the path ${pptFilePath} exists.`),
    );
    process.exit();
  }

  global.source = source;
  global.targetFolder = targetFolder;

  // With --entry, multiple framework builds share the same -o; only nuke this
  // entry's own wrapper dir so other entries' outputs survive. Shared content
  // (animation/, sd.js, vendor/) is re-emitted by walk + copy below anyway.
  const cleanRoot = entry === "." ? targetFolder : `${targetFolder}/${entry}`;
  cleanDir(cleanRoot);
  copyVendorAssets(global.projectRoot, targetFolder);
  if (!global.framework || global.framework === "reveal") {
    theme(path.join(targetFolder, "vendor", "themes"));
  }
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
    eventListener[suffix].onAdd(
      toOriginFile(source, p),
      toTargetFolder(source, targetFolder, p),
    );
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
        toOriginFile(source, p),
        toTargetFolder(source, targetFolder, p),
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
      eventListener[suffix].onAdd(
        toOriginFile(source, p),
        toTargetFolder(source, targetFolder, p),
      );
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
      eventListener[suffix].onUnlink(toTargetFile(source, targetFolder, p));
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
  const host = getHost();
  if (!global.sd) copyAsset("./dist/sd.js", pptOutputPath);
  if (host.libraryBundle && !global.reveal) {
    copyAsset(host.libraryBundle, pptOutputPath);
  }
  return task(source, pptOutputPath);
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

function cleanDir(p: string, isRoot = true): void {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const full = `${p}/${entry.name}`;
    if (entry.isDirectory()) cleanDir(full, false);
    else fs.unlinkSync(full);
  }
  if (!isRoot && fs.readdirSync(p).length === 0) fs.rmdirSync(p);
}

function getConfiguration() {
  const isDev = global.d ? true : false;
  const mode = isDev ? "development" : "production";
  const isWatch = global.w ? true : false;
  const entry = global.entry || ".";
  // Asset base URL: a remote deploy passes -d https://your-domain; otherwise the
  // output is self-contained and the framework wrapper at <out>/<entry>/index.html
  // walks `depth` levels up to reach the project root where sd.js / vendor sit.
  const base =
    global.domain !== undefined
      ? global.domain
      : entry === "."
        ? "."
        : entry
            .split("/")
            .map(() => "..")
            .join("/");
  const filename = entry === "." ? "index.html" : `${entry}/index.html`;
  const host = getHost();
  const plugins = [
    new HtmlWebpackPlugin({
      template: host.template,
      filename,
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
  // Namespace the framework wrapper's emitted assets under <entry>/ so that
  // running multiple framework builds into the same -o (one per --entry) does
  // not collide on main.js or on CSS-referenced asset files.
  const outputPrefix = entry === "." ? "" : `${entry}/`;
  return {
    mode,
    watch: isWatch,
    plugins,
    entry: host.entry,
    output: {
      filename: `${outputPrefix}main.js`,
      assetModuleFilename: `${outputPrefix}[hash][ext]`,
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

if (import.meta.main) launch(true);
