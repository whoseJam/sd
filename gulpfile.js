const gulp = require("gulp");
const sd = require("./packages/cli/src/sd");
const type = require("./packages/cli/src/type");
const animation = require("./packages/cli/src/animation");
const animationGroup = require("./packages/cli/src/animationGroup");
const element = require("./packages/cli/src/element");
const ppt = require("./packages/cli/src/ppt");
const reveal = require("./packages/cli/src/reveal");
const revealPlugin = require("./packages/cli/src/revealPlugin");
const theme = require("./packages/cli/src/theme");
const parser = require("./packages/cli/src/parser");

global["projectRoot"] = __dirname.replaceAll("\\", "/");

parser.parseInput();

gulp.task("sd", () => {
    global["sd"] = true;
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return sd(pptOutputPath);
});

gulp.task("reveal", () => {
    global["reveal"] = true;
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return reveal(pptOutputPath);
});

gulp.task("revealPlugin", () => {
    const pluginOutputPath = global["o"];
    return revealPlugin(pluginOutputPath);
});

gulp.task("theme", async () => {
    global["theme"] = true;
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return theme(pptOutputPath);
});

gulp.task("type", () => {
    return type.launch(false);
});

gulp.task("animation", () => {
    return animation.launch(false);
});

gulp.task("animationGroup", done => {
    animationGroup.launch(false);
    done();
});

gulp.task("element", () => {
    const outputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return element(outputPath);
});

gulp.task("ppt", () => {
    return ppt.launch(false);
});

gulp.task("serve", done => {
    const port = global["p"] || "8080";
    const exec = require("child_process").exec;
    const pptOutputPath = parser.parseConfig("pptOutputPath");
    exec(`cd ${pptOutputPath} && live-server --cors --port=${port}`, function (error, stdout, stderr) {
        if (error) console.log(error);
        else console.log("success");
        done();
    });
});
