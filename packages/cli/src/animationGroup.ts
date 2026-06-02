#!/usr/bin/env bun

import colors from "colors-console";
import gulp from "gulp";
import fs from "node:fs";
import path from "node:path";

import * as animation from "./animation";
import { parseConfig, parseInput } from "./parser";
import { copyFile, copyVendorAssets } from "./utils";

interface FileEventListener {
  onAdd: (filePath: string, destFolderPath: string) => void;
  onChange: () => void;
  onUnlink: () => void;
}

const eventListener: Record<string, FileEventListener> = {};

const onAddEntry = (filePath: string, dest: string) => {
  gulp.task(filePath, () => animation.task(filePath, dest));
  gulp.task(filePath)();
};

defineEventListener("js", {
  onAdd: onAddEntry,
  onChange: () => {},
  onUnlink: () => {},
});
defineEventListener("ts", {
  onAdd: onAddEntry,
  onChange: () => {},
  onUnlink: () => {},
});

export function task(source: string, targetFolder: string): void {
  global.source = source;
  global.targetFolder = targetFolder;

  walk(source, (p: string) => {
    const suffix = p.split(".").slice(-1)[0];
    if (suffix !== "js" && suffix !== "ts") return;
    eventListener[suffix].onAdd(pathToOriginFile(p), pathToTargetFolder(p));
  });

  if (global.w) {
    const watcher = gulp.watch(`${source}/**`);
    watcher.on("add", function (p: string) {
      p = p.replaceAll("\\", "/");
      const suffix = p.split(".").slice(-1)[0];
      if (suffix !== "js" && suffix !== "ts") return;
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
      if (suffix !== "js" && suffix !== "ts") return;
      if (!eventListener[suffix] || !eventListener[suffix].onUnlink) {
        console.log(
          colors(
            "red",
            `[Error] No 'onUnlink' handler defined for file with extension ${suffix} at ${p}.`,
          ),
        );
        return;
      }
      eventListener[suffix].onUnlink();
    });
  }
}

export function launch(selfLaunch = true): void {
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
        "Usage: animationGroup -i <source folder path> [-o <target folder path>]",
      ),
    );
    process.exit();
  }
  if (!global.sd) {
    copyFile("./dist/sd.js", animationOutputPath);
    copyVendorAssets(global.projectRoot, animationOutputPath);
  }
  task(source, animationOutputPath);
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

function pathToTargetFolder(p: string): string {
  return `${global.targetFolder}/${relativePathWithoutFile(p)}`;
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

if (import.meta.main) launch(true);
