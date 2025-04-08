#!/usr/bin/env node

const w = require("webpack");
const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const utils = require("./utils");
const parser = require("./parser");
const colors = require("colors-console");
const webpack = require("webpack-stream");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function validateJSFile(sourceFilePath) {
    if (!fs.existsSync(sourceFilePath)) {
        console.log(colors("red", `[Error] File ${sourceFilePath} not found. Please check if the input path is correct.`));
        process.exit();
    }
    if (!sourceFilePath.toLowerCase().endsWith(".js")) {
        console.log(colors("red", `[Error] Invalid file type. The file must be a JavaScript (.js) file.`));
        process.exit();
    }
    try {
        fs.accessSync(sourceFilePath, fs.constants.R_OK);
    } catch (err) {
        console.log(colors("red", `[Error] Cannot read the file. Check file permissions.`));
        process.exit();
    }
}

/**
 * Compile xxx.js to the target folder.
 * @param {string} source The source js file path.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
function task(source, targetFolder) {
    source = source.replace("\\", "/");
    validateJSFile(source);
    const file = String(source).split("/").slice(-1)[0].split(".")[0];
    const config = getConfiguration(file);
    return (
        gulp
            // webpack stream
            .src(source)
            .pipe(webpack(config))
            .pipe(gulp.dest(targetFolder))
    );
}

/**
 * Launch the animation task, processing the input.
 * @param {boolean} selfLaunch If the launch is created by this file.
 * @returns {NodeJS.ReadWriteStream}
 */
function launch(selfLaunch = true) {
    if (require.main !== module && selfLaunch) return;
    if (require.main === module) global["projectRoot"] = path.resolve(__dirname, "..");
    parser.parseInput();
    const animationOutputPath = global["o"] || parser.parseConfig("animationOutputPath");
    const sourceFilePath = global["i"];
    if (!sourceFilePath) {
        console.log(colors("red", "[Error] Please provide the source file path."));
        console.log(colors("cyan", "Usage: animation -i <source file path> [-o <target path>]"));
        process.exit();
    }
    if (global["l"] && !global["sd"]) utils.copyFile("./dist/sd.js", parser.parseConfig("pptOutputPath"));
    return task(sourceFilePath, animationOutputPath);
}

function getConfiguration(file) {
    const mode = "development";
    const watch = global["w"] ? true : false;
    const suffix = global["domain"] !== undefined ? "" : global["l"] ? "Local" : "Remote";
    const plugins = [
        new HtmlWebpackPlugin({
            template: `${global["projectRoot"]}/build/aniIndex${suffix}.html`,
            inject: "body",
            inlineSource: ".(js)$",
            minify: false,
            filename: `${file}.html`,
            scriptLoading: "blocking",
            templateParameters: {
                domain: global["domain"],
            },
        }),
    ];
    return {
        mode,
        watch,
        output: {
            filename: `${file}.js`,
        },
        plugins,
        module: {
            rules: [
                {
                    test: /.js$/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                { test: /\.css$/, use: ["style-loader", "css-loader"] },
            ],
        },
        performance: {
            hints: false,
        },
        cache: true,
        externals: {
            "@/sd": "sd",
            "slidew": "sd",
        },
    };
}

launch(true);

module.exports = {
    task,
    launch,
};
