const gulp = require("gulp");
const path = require("path");
const webpack = require("webpack-stream");
const JavaScriptObfuscator = require("webpack-obfuscator");

const obfuscator = new JavaScriptObfuscator({
    identifierNamesGenerator: "mangled",
    splitStrings: true,
});

/**
 * Compile sd.js to the target folder.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
module.exports = function (targetFolder) {
    const config = getConfiguration();
    return (
        gulp
            // webpack stream
            .src("./SD/sd.js")
            .pipe(webpack(config))
            .pipe(gulp.dest(targetFolder))
    );
};

function getConfiguration() {
    const plugins = [];
    if (!global["d"]) plugins.push(obfuscator);
    const mode = global["d"] ? "development" : "production";
    const watch = global["w"] ? true : false;
    return {
        mode,
        watch,
        plugins,
        output: {
            filename: "sd.js",
            library: "sd",
            libraryTarget: "umd",
            umdNamedDefine: true,
            globalObject: "this",
        },
        module: {
            rules: [
                {
                    test: /.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-react", "@babel/preset-env"],
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
            extensions: [".tsx", ".ts", ".js"],
        },
        externals: {
            dagre: "dagre",
        },
    };
}
