#!/usr/bin/env node

const w = require("webpack");
const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const parser = require("./parser");
const webpack = require("webpack-stream");
const animationTask = require("./animation");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const colors = require("colors-console");

const eventListener = {};

let shouldPutInAnimationList = true;
const animationList = [];

defineEventListener("cpp", {
    onAdd: copyCPPFile,
    onChange: copyCPPFile,
    onUnlink: cleanCPPFile,
});
defineEventListener("html|md|txt", {
    onAdd: copyFile,
    onChange: copyFile,
    onUnlink: cleanFile,
});
defineEventListener("png|jpg|jpeg", {
    onAdd: copyImage,
    onChange: copyImage,
    onUnlink: cleanFile,
});
defineEventListener("js", {
    onAdd: function (path, destFolderPath) {
        gulp.task(path, done => {
            return animationTask(path, destFolderPath, true);
        });
        if (shouldPutInAnimationList) {
            animationList.push(path);
        } else {
            gulp.task(path)();
        }
    },
    onChange: function () {},
    onUnlink: function () {},
});

function task(sourceFileFolder, targetFileFolder) {
    const pptFilePath = `${sourceFileFolder}/ppt.html`;

    if (!fs.existsSync(pptFilePath)) {
        console.log(colors("red", `[Error] Please check if the path ${pptFilePath} exists.`));
        process.exit();
    }

    gulp.task("ppt-task", () => {
        return gulp
            .src(pptFilePath)
            .pipe(webpack(configuration(pptFilePath)))
            .pipe(gulp.dest(targetFileFolder));
    });

    let project = gulp.task("ppt-task");

    global.sourceFileFolder = sourceFileFolder;
    global.targetFileFolder = targetFileFolder;

    cleanAllFiles(targetFileFolder);
    cleanAllEmptyDirectories(targetFileFolder);
    walk(sourceFileFolder, path => {
        const suffix = path.split(".").slice(-1)[0];
        if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
            console.log(colors("red", `[Error] No 'onAdd' handler defined for file with extension ${suffix} at ${path}.`));
            return;
        }
        eventListener[suffix].onAdd(pathToOriginFile(path), pathToTargetFolder(path));
    });
    animationList.forEach(task => {
        project = gulp[global["w"] ? "parallel" : "series"](project, gulp.task(task));
    });
    shouldPutInAnimationList = false;

    if (global["w"]) {
        const watcher = gulp.watch(`${sourceFileFolder}/**`);
        watcher.on("change", function (path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (!eventListener[suffix] || !eventListener[suffix].onChange) {
                console.log(colors("red", `[Error] No 'onChange' handler defined for file with extension ${suffix} at ${path}.`));
                return;
            }
            eventListener[suffix].onChange(pathToOriginFile(path), pathToTargetFolder(path));
        });
        watcher.on("add", function (path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
                console.log(colors("red", `[Error] No 'onAdd' handler defined for file with extension ${suffix} at ${path}.`));
                return;
            }
            eventListener[suffix].onAdd(pathToOriginFile(path), pathToTargetFolder(path));
        });
        watcher.on("unlink", function (path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (!eventListener[suffix] || !eventListener[suffix].onUnlink) {
                console.log(colors("red", `[Error] No 'onUnlink' handler defined for file with extension ${suffix} at ${path}.`));
                return;
            }
            eventListener[suffix].onUnlink(pathToTargetFile(path));
        });
    }

    project();
}

function relativePath(filePath) {
    const A = filePath.split("/");
    const B = sourceFileFolder.split("/");
    let indexA = 0,
        indexB = 0;
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
    return `${sourceFileFolder}/${relativePath(path)}`;
}

function pathToTargetFile(path) {
    return `${targetFileFolder}/${relativePath(path)}`;
}

function pathToTargetFolder(path) {
    return `${targetFileFolder}/${relativePathWithoutFile(path)}`;
}

function copyFile(srcPath, destFolderPath) {
    return gulp.src(srcPath).pipe(gulp.dest(destFolderPath));
}

function copyCPPFile(srcPath, destFolderPath) {
    return copyFile(srcPath, `${targetFileFolder}/std`);
}

function copyImage(srcPath, destFolderPath) {
    return gulp.src(srcPath, { encoding: false }).pipe(gulp.dest(destFolderPath));
}

function cleanFile(path) {
    const stats = fs.statSync(path);
    if (stats.isFile()) fs.unlinkSync(path);
}

function cleanCPPFile(path) {
    const fileName = path.split("/").slice(-1)[0];
    cleanFile(`${targetFileFolder}/std/${fileName}`);
}

function cleanAllFiles(path) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            cleanAllFiles(filePath);
        } else {
            fs.unlinkSync(filePath);
        }
    });
}

function cleanAllEmptyDirectories(path, level = 0) {
    const files = fs.readdirSync(path);
    if (files.length > 0) {
        let tempFile = 0;
        files.forEach(file => {
            tempFile++;
            cleanAllEmptyDirectories(`${path}/${file}`, 1);
        });
        if (tempFile === files.length && level !== 0) {
            fs.rmdirSync(path);
        }
    } else {
        level !== 0 && fs.rmdirSync(path);
    }
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

function configuration() {
    // pptFilePath: ./work/xxx/ppt.html
    const suffix = global["l"] ? "Local" : "Remote";
    return {
        mode: global["d"] ? "development" : "production",
        entry: `${global["projectRoot"]}/build/pptMain.js`,
        watch: global["w"] ? true : false,
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/build/pptIndex${suffix}.html`,
                inject: "body",
                scriptLoading: "blocking",
            }),
            new w.DefinePlugin({
                __VERSION__: JSON.stringify("1.0.0"),
                DEFINE_LOCAL: global["l"],
            }),
        ],
        module: {
            rules: [
                { test: /\.tsx?$/, use: ["ts-loader"] },
                { test: /.html$/, use: ["html-loader"] },
                { test: /\.(s[ac]ss|css)$/, use: ["style-loader", "css-loader", "sass-loader"] },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
    };
}

if (require.main === module) {
    global["projectRoot"] = path.resolve(__dirname, "..");
    parser.parseInput();
    const sourceFileFolder = global["i"];
    const targetFileFolder = global["o"] || parser.parseConfig("pptOutputPath");
    if (!sourceFileFolder) {
        console.log(colors("red", "[Error] Please provide the source folder path."));
        console.log(colors("cyan", "Usage: ppt -i <source folder path> [-o <target folder path>]"));
        process.exit(1);
    }
    task(sourceFileFolder, targetFileFolder);
}

module.exports = task;
