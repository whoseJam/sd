const gulp = require("gulp");
const sd = load("./build/sd");
const animation = require("./build/animation");
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

function copyFile(src, dest) {
    return gulp.src(src).pipe(gulp.dest(dest));
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
    const pptOutputPath = parser.parseConfig("pptOutputPath");
    const animationOutputPath = global["o"] || parser.parseConfig("animationOutputPath");
    if (global["l"] && !global["sd"]) copyFile("./dist/sd.js", pptOutputPath);
    return animation(global["i"], animationOutputPath);
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

gulp.task("ppt", done => {
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    if (global["l"] && !global["sd"]) copyFile("./dist/sd.js", pptOutputPath);
    if (global["l"] && !global["theme"]) {
        copyFile("./dist/beige.css", pptOutputPath);
        copyFile("./dist/dracula.css", pptOutputPath);
        copyFile("./dist/serif.css", pptOutputPath);
        copyFile("./dist/serif.css", pptOutputPath);
        copyFile("./dist/simple.css", pptOutputPath);
        copyFile("./dist/sky.css", pptOutputPath);
        copyFile("./dist/solarized.css", pptOutputPath);
        copyFile("./dist/white.css", pptOutputPath);
    }
    if (global["l"] && !global["reveal"]) copyFile("./dist/myreveal.js", pptOutputPath);
    ppt(global["i"], pptOutputPath);
    done();
});

gulp.task("serve", done => {
    const exec = require("child_process").exec;
    const pptOutputPath = parser.parseConfig("pptOutputPath");
    exec(`cd ${pptOutputPath} && live-server`, function (error, stdout, stderr) {
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
