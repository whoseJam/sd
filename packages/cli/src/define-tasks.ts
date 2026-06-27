// defineTasks(gulp) registers every gulp task used by a sd-monorepo or
// downstream consumer. Lives in the cli package so the workspace gulpfile
// and the scaffolded-project gulpfile share one source of truth.

import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import * as animationGroup from "./animation-group.js";
import * as animation from "./animation.js";
import element from "./element.js";
import impress from "./impress.js";
import * as parser from "./parser.js";
import { walk } from "./path-utils.js";
import * as ppt from "./ppt.js";
import reveal from "./reveal.js";
import sd from "./sd.js";
import theme from "./theme.js";
import * as type from "./type.js";
import { copyVendorAssets } from "./utils.js";
import webslides from "./webslides.js";

type GulpLike = {
  task: (name: string, fn: (done: () => void) => unknown) => unknown;
};

export function defineTasks(gulp: GulpLike): void {
  parser.parseInput();

  gulp.task("sd", () => {
    global.sd = true;
    const pptOutputPath = global.o || parser.parseConfig("pptOutputPath");
    return sd(pptOutputPath);
  });

  gulp.task("reveal", () => {
    global.reveal = true;
    const pptOutputPath = global.o || parser.parseConfig("pptOutputPath");
    return reveal(pptOutputPath);
  });

  gulp.task("webslides", () => {
    global.webslides = true;
    const pptOutputPath = global.o || parser.parseConfig("pptOutputPath");
    return webslides(pptOutputPath);
  });

  gulp.task("impress", () => {
    global.impress = true;
    const pptOutputPath = global.o || parser.parseConfig("pptOutputPath");
    return impress(pptOutputPath);
  });

  gulp.task("theme", () => {
    const pptOutputPath = global.o || parser.parseConfig("pptOutputPath");
    return theme(pptOutputPath);
  });

  gulp.task("vendor", () => {
    const outputPath = global.o || parser.parseConfig("pptOutputPath");
    copyVendorAssets(outputPath);
    return theme(path.join(outputPath, "vendor", "themes"));
  });

  gulp.task("type", () => type.launch(false));
  gulp.task("animation", () => animation.launch(false));
  gulp.task("animation-group", () => animationGroup.launch(false));

  gulp.task("element", () => {
    const outputPath = global.o || parser.parseConfig("pptOutputPath");
    return element(outputPath);
  });

  gulp.task("ppt", () => ppt.launch(false));

  gulp.task("serve", (done) => {
    const port = global.p || "8080";
    const root = global.o ?? parser.parseConfig("pptOutputPath");
    exec(`live-server --cors --port=${port} "${root}"`, function (error) {
      if (error) console.log(error);
      done();
    });
  });

  gulp.task("preview", async () => {
    const pptOutputPath = global.o ?? parser.parseConfig("pptOutputPath");
    const source = global.i;
    if (!source) {
      console.log("[Error] -i required for preview");
      process.exit(1);
    }

    global.sd = true;
    global.targetFolder = pptOutputPath;

    await streamDone(sd(pptOutputPath));

    const animSrc = path.join(path.dirname(path.resolve(source)), "animation");
    if (fs.existsSync(animSrc)) {
      const animOut = path.join(pptOutputPath, "animation");
      const streams: Promise<void>[] = [];
      walk(animSrc, (p) => {
        if (p.endsWith(".ts") || p.endsWith(".js")) {
          streams.push(streamDone(animation.task(p, animOut)));
        }
      });
      await Promise.all(streams);
    }

    await streamDone(ppt.launch(false) as NodeJS.ReadWriteStream);

    const port = global.p || "8080";
    exec(`live-server --cors --port=${port} "${pptOutputPath}"`);
  });
}

function streamDone(stream: NodeJS.ReadWriteStream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.on("end", resolve).on("error", reject);
  });
}
