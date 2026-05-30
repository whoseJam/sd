#!/usr/bin/env node

const gulp = require("gulp");
const path = require("path");
const utils = require("./utils");
const parser = require("./parser");
const colors = require("colors-console");
const webpack = require("webpack-stream");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function truncateAtStackTrace(errorMessage) {
    const index = errorMessage.indexOf("    at");
    return index !== -1 ? errorMessage.substring(0, index) : errorMessage;
}

/**
 * Compile xxx.js to the target folder.
 * @param {string} source The source js file path.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
function task(source, targetFolder) {
    source = source.replaceAll("\\", "/");
    utils.validateJSFile(source);
    const file = String(source).split("/").slice(-1)[0].split(".")[0];
    const config = getConfiguration(file);
    return (
        gulp
            // webpack stream
            .src(source)
            .pipe(webpack(config))
            .on("error", error => {
                if (global["s"]) {
                    console.error(truncateAtStackTrace(error.message));
                    process.exit(1);
                }
            })
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
    if (require.main === module) global["projectRoot"] = path.resolve(__dirname, "..", "..", "..");
    parser.parseInput();
    const animationOutputPath = global["o"] || parser.parseConfig("animationOutputPath");
    const sourceFilePath = global["i"];
    if (!sourceFilePath) {
        console.log(colors("red", "[Error] Please provide the source file path."));
        console.log(colors("cyan", "Usage: animation -i <source file path> [-o <target path>]"));
        process.exit();
    }
    if (global["l"] && !global["sd"] && !global["s"])
        utils.copyFile("./dist/sd.js", parser.parseConfig("pptOutputPath"));
    if (global["l"] && !global["sd"] && !global["s"])
        utils.copyFonts("./dist/fonts", `${parser.parseConfig("pptOutputPath")}/fonts`);
    return task(sourceFilePath, animationOutputPath);
}

function getConfiguration(file) {
    const mode = "development";
    const watch = global["w"] ? true : false;
    const suffix = global["domain"] !== undefined ? "" : global["l"] ? "Local" : "Remote";
    const plugins = [
        new HtmlWebpackPlugin({
            template: `${global["projectRoot"]}/packages/cli/src/aniIndex${suffix}.html`,
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
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                allowJs: true,
                                jsx: "react",
                                esModuleInterop: true,
                                allowSyntheticDefaultImports: true,
                                target: "ES6",
                                module: "ESNext",
                                moduleResolution: "Node",
                                resolveJsonModule: true,
                                sourceMap: mode === "development",
                                strict: false,
                                skipLibCheck: true,
                                allowDeclareFields: true,
                            },
                            transpileOnly: true,
                            experimentalFileCaching: true,
                        },
                    },
                },
                { test: /\.css$/, use: ["style-loader", "css-loader"] },
            ],
        },
        performance: {
            hints: false,
        },
        cache: true,
        resolve: {
            alias: {
                "@": path.resolve(global["projectRoot"], "SD"),
            },
            extensions: [".tsx", ".ts", ".jsx", ".js"],
        },
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
