#!/usr/bin/env bun

import colors from "colors-console";
import gulp from "gulp";

import * as animation from "./animation.js";
import { parseInput, requireOutputPath } from "./parser.js";
import { toOriginFile, toTargetFolder, walk } from "./path-utils.js";
import { copyFile, copyVendorAssets } from "./utils.js";

const onAddEntry = (filePath: string, dest: string): Promise<void> =>
  new Promise((resolve) => {
    animation.task(filePath, dest).on("end", resolve);
  });

export function task(source: string, targetFolder: string): Promise<void> {
  global.source = source;
  global.targetFolder = targetFolder;

  const promises: Promise<void>[] = [];
  walk(source, (p: string) => {
    const suffix = p.split(".").slice(-1)[0];
    if (suffix !== "js" && suffix !== "ts") return;
    promises.push(
      onAddEntry(
        toOriginFile(source, p),
        toTargetFolder(source, targetFolder, p),
      ),
    );
  });

  if (global.w) {
    const watcher = gulp.watch(`${source}/**`);
    watcher.on("add", (p: string) => {
      p = p.replaceAll("\\", "/");
      const suffix = p.split(".").slice(-1)[0];
      if (suffix !== "js" && suffix !== "ts") return;
      onAddEntry(
        toOriginFile(source, p),
        toTargetFolder(source, targetFolder, p),
      );
    });
  }

  return Promise.all(promises).then(() => {});
}

export function launch(selfLaunch = true): void | Promise<void> {
  if (!import.meta.main && selfLaunch) return;
  parseInput();
  const source = global.i;
  if (!source) {
    console.log(
      colors("red", "[Error] Please provide the source folder path."),
    );
    console.log(
      colors(
        "cyan",
        "Usage: animation-group -i <source folder path> -o <target folder path>",
      ),
    );
    process.exit(1);
  }
  const outputPath = requireOutputPath("animation-group");
  if (!global.sd && !global.externalAssets) {
    copyFile("./dist/sd.js", outputPath);
    copyVendorAssets(outputPath);
  }
  return task(source, outputPath);
}

if (import.meta.main) launch(true);
