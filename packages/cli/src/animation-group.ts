#!/usr/bin/env bun

import colors from "colors-console";
import gulp from "gulp";
import path from "node:path";

import * as animation from "./animation";
import { parseConfig, parseInput } from "./parser";
import { toOriginFile, toTargetFolder, walk } from "./path-utils";
import { copyFile, copyVendorAssets } from "./utils";

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
  if (import.meta.main) {
    global.projectRoot = path.resolve(import.meta.dirname, "..", "..", "..");
  }
  parseInput();
  const animationOutputPath = global.o || parseConfig("animationOutputPath");
  const source = global.i;
  if (!source) {
    console.log(
      colors("red", "[Error] Please provide the source folder path."),
    );
    console.log(
      colors(
        "cyan",
        "Usage: animation-group -i <source folder path> [-o <target folder path>]",
      ),
    );
    process.exit();
  }
  if (!global.sd) {
    copyFile("./dist/sd.js", animationOutputPath);
    copyVendorAssets(global.projectRoot, animationOutputPath);
  }
  return task(source, animationOutputPath);
}

if (import.meta.main) launch(true);
