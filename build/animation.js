#!/usr/bin/env node

const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
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

function getConfiguration(file) {
    const mode = global["d"] ? "development" : "production";
    const watch = global["w"] ? true : false;
    const suffix = global["l"] ? "Local" : "Remote";
    return {
        mode,
        watch,
        output: {
            filename: `${file}.js`,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/build/aniIndex${suffix}.html`,
                inject: "body",
                inlineSource: ".(js)$",
                minify: false,
                filename: `${file}.html`,
                scriptLoading: "blocking",
            }),
        ],
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

if (require.main === module) {
    global["projectRoot"] = path.resolve(__dirname, "..");
    parser.parseInput();
    const sourceFilePath = global["i"];
    const targetFilePath = global["o"] || parser.parseConfig("animationOutputPath");
    if (!sourceFilePath) {
        console.log(colors("red", "[Error] Please provide the source file path."));
        console.log(colors("cyan", "Usage: animation -i <source file path> [-o <target path>]"));
        process.exit(1);
    }
    task(sourceFilePath, targetFilePath);
}

module.exports = task;
