import gulp from "gulp";
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import * as animation from "./packages/cli/src/animation";
import * as animationGroup from "./packages/cli/src/animation-group";
import element from "./packages/cli/src/element";
import * as parser from "./packages/cli/src/parser";
import { walk } from "./packages/cli/src/path-utils";
import * as ppt from "./packages/cli/src/ppt";
import reveal from "./packages/cli/src/reveal";
import sd from "./packages/cli/src/sd";
import theme from "./packages/cli/src/theme";
import * as type from "./packages/cli/src/type";

global.projectRoot = import.meta.dirname.replaceAll("\\", "/");

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

gulp.task("theme", async () => {
  const pptOutputPath = global.o || parser.parseConfig("pptOutputPath");
  return theme(pptOutputPath);
});

gulp.task("type", () => {
  return type.launch(false);
});

gulp.task("animation", () => {
  return animation.launch(false);
});

gulp.task("animation-group", () => {
  return animationGroup.launch(false);
});

gulp.task("element", () => {
  const outputPath = global.o || parser.parseConfig("pptOutputPath");
  return element(outputPath);
});

gulp.task("ppt", () => {
  return ppt.launch(false);
});

gulp.task("serve", (done) => {
  const port = global.p || "8080";
  const root = global.o ?? parser.parseConfig("pptOutputPath");
  exec(`live-server --cors --port=${port} "${root}"`, function (error) {
    if (error) console.log(error);
    done();
  });
});

function streamDone(stream: NodeJS.ReadWriteStream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.on("end", resolve).on("error", reject);
  });
}

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
