#!/usr/bin/env node

const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const utils = require("./utils");
const parser = require("./parser");
const animation = require("./animation");
const colors = require("colors-console");
const eventListener = {};

defineEventListener("js", {
    onAdd: function (path, dest) {
        gulp.task(path, () => {
            return animation.task(path, dest);
        });
        gulp.task(path)();
    },
    onChange: function () {},
    onUnlink: function () {},
});

/**
 * Compile all the animations in the source folder to the target folder.
 * @param {string} source The source folder that hold the animations.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
function task(source, targetFolder) {
    global.source = source;
    global.targetFolder = targetFolder;

    walk(source, path => {
        const suffix = path.split(".").slice(-1)[0];
        if (suffix !== "js") return;
        eventListener[suffix].onAdd(pathToOriginFile(path), pathToTargetFolder(path));
    });

    if (global["w"]) {
        const watcher = gulp.watch(`${source}/**`);
        watcher.on("add", function (path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (suffix !== "js") return;
            if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
                console.log(colors("red", `[Error] No 'onAdd' handler defined for file with extension ${suffix} at ${path}.`));
                return;
            }
            eventListener[suffix].onAdd(pathToOriginFile(path), pathToTargetFolder(path));
        });
        watcher.on("unlink", function (path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (suffix !== "js") return;
            if (!eventListener[suffix] || !eventListener[suffix].onUnlink) {
                console.log(colors("red", `[Error] No 'onUnlink' handler defined for file with extension ${suffix} at ${path}.`));
                return;
            }
            eventListener[suffix].onUnlink(pathToTargetFile(path));
        });
    }
}

/**
 * @param {boolean} selfLaunch
 */
function launch(selfLaunch = true) {
    if (require.main !== module && selfLaunch) return;
    if (require.main === module) global["projectRoot"] = path.resolve(__dirname, "..");
    parser.parseInput();
    const pptOutputPath = parser.parseConfig("pptOutputPath");
    const animationOutputPath = global["o"] || parser.parseConfig("animationOutputPath");
    const source = global["i"];
    if (!source) {
        console.log(colors("red", "[Error] Please provide the source folder path."));
        console.log(colors("cyan", "Usage: animationGroup -i <source folder path> [-o <target folder path>]"));
        process.exit();
    }
    if (global["l"] && !global["sd"]) utils.copyFile("./dist/sd.js", pptOutputPath);
    task(source, animationOutputPath);
}

function relativePath(filePath) {
    const A = filePath.split("/");
    const B = global["source"].split("/");
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

function relativePathWithoutFile(filePath) {
    const path = relativePath(filePath);
    return path.split("/").slice(0, -1).join("/");
}

function pathToOriginFile(path) {
    return `${global["source"]}/${relativePath(path)}`;
}

function pathToTargetFile(path) {
    return `${global["targetFolder"]}/${relativePath(path)}`;
}

function pathToTargetFolder(path) {
    return `${global["targetFolder"]}/${relativePathWithoutFile(path)}`;
}

function walk(directoryPath, callback) {
    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = `${directoryPath}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            callback(filePath);
        } else if (stats.isDirectory()) {
            walk(filePath, callback);
        }
    });
}

function defineEventListener(suffix, listener) {
    const allSuffix = suffix.split("|");
    allSuffix.forEach(suffix => {
        eventListener[suffix] = listener;
    });
}

launch(true);

module.exports = {
    task,
    launch,
};
