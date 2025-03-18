const gulp = require("gulp");
const sd = load("./build/sd");
const animation = require("./build/animation");
const animationGroup = require("./build/animationGroup");
const github = load("./build/github");
const iframe = load("./build/iframe");
const ppt = require("./build/ppt");
const rag = load("./build/rag");
const release = load("./build/release");
const reveal = require("./build/reveal");
const revealPlugin = require("./build/revealPlugin");
const theme = require("./build/theme");
const parser = require("./build/parser");

function load(path) {
    try {
        const module = require(path);
        return module;
    } catch (_) {
        return undefined;
    }
}

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

gulp.task("animation", () => {
    return animation.launch(false);
});

gulp.task("animationGroup", done => {
    animationGroup.launch(false);
    done();
});

gulp.task("iframe", () => {
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return iframe(pptOutputPath);
});

gulp.task("release", () => {
    const releaseOutputPath = global["o"] || parser.parseConfig("releaseOutputPath");
    return release(releaseOutputPath);
});

gulp.task("github", () => {
    const githubOutputPath = global["o"] || parser.parseConfig("githubOutputPath");
    return github(githubOutputPath);
});

gulp.task("ppt", () => {
    return ppt.launch(false);
});

gulp.task("serve", done => {
    const port = global["p"] || "8080";
    const exec = require("child_process").exec;
    const pptOutputPath = parser.parseConfig("pptOutputPath");
    exec(`cd ${pptOutputPath} && live-server --port=${port}`, function (error, stdout, stderr) {
        if (error) console.log(error);
        else console.log("success");
        done();
    });
});

gulp.task("rag", done => {
    const ragOutputPath = global["o"] || parser.parseConfig("ragOutputPath");
    rag(ragOutputPath);
    done();
});
