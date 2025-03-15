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
        gulp.task(path, () => {
            return animationTask(path, destFolderPath, true);
        });
        gulp.task(path)();
    },
    onChange: function () {},
    onUnlink: function () {},
});

/**
 * Compile the ppt project to the target folder.
 * @param {string} source The source of the ppt project. Ensure ppt.html exists.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
function task(source, targetFolder) {
    const pptFilePath = `${source}/ppt.html`;

    if (!fs.existsSync(pptFilePath)) {
        console.log(colors("red", `[Error] Please check if the path ${pptFilePath} exists.`));
        process.exit();
    }

    global.source = source;
    global.targetFolder = targetFolder;

    cleanAllFiles(targetFolder);
    cleanAllEmptyDirectories(targetFolder);
    walk(source, path => {
        const suffix = path.split(".").slice(-1)[0];
        if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
            console.log(colors("red", `[Error] No 'onAdd' handler defined for file with extension ${suffix} at ${path}.`));
            return;
        }
        eventListener[suffix].onAdd(pathToOriginFile(path), pathToTargetFolder(path));
    });

    if (global["w"]) {
        const watcher = gulp.watch(`${source}/**`);
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

    return gulp
        .src(pptFilePath)
        .pipe(webpack(getConfiguration(pptFilePath)))
        .pipe(gulp.dest(targetFolder));
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

function copyFile(srcPath, destFolderPath) {
    return gulp.src(srcPath).pipe(gulp.dest(destFolderPath));
}

function copyCPPFile(srcPath, destFolderPath) {
    return copyFile(srcPath, `${global["targetFolder"]}/std`);
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
    cleanFile(`${global["targetFolder"]}/std/${fileName}`);
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

function getConfiguration() {
    // pptFilePath: ./work/xxx/ppt.html
    const mode = global["d"] ? "development" : "production";
    const watch = global["w"] ? true : false;
    const suffix = global["l"] ? "Local" : "Remote";
    return {
        mode,
        watch,
        entry: `${global["projectRoot"]}/build/pptMain.js`,
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
    const source = global["i"];
    const targetFolder = global["o"] || parser.parseConfig("pptOutputPath");
    if (!source) {
        console.log(colors("red", "[Error] Please provide the source folder path."));
        console.log(colors("cyan", "Usage: ppt -i <source folder path> [-o <target folder path>]"));
        process.exit(1);
    }
    task(source, targetFolder);
}

module.exports = task;
