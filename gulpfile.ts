import gulp from "gulp";
import { exec } from "node:child_process";

import * as animation from "./packages/cli/src/animation";
import * as animationGroup from "./packages/cli/src/animation-group";
import element from "./packages/cli/src/element";
import * as parser from "./packages/cli/src/parser";
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

gulp.task("animation-group", (done) => {
  animationGroup.launch(false);
  done();
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
  const pptOutputPath = parser.parseConfig("pptOutputPath");
  exec(
    `cd ${pptOutputPath} && live-server --cors --port=${port}`,
    function (error) {
      if (error) console.log(error);
      else console.log("success");
      done();
    },
  );
});
