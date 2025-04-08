const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const webpack = require("webpack-stream");
const TerserPlugin = require("terser-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

function extractReversedNames() {
    const filePath = path.join(__dirname, "../SD/sd.js");
    try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const regex = /\{([^}]+)\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(fileContent)) !== null) {
            const contents = match[1].split(",");
            contents.forEach(content => {
                content = content.trim();
                if (content === "CONTINUE_FRAME") return;
                if (/^[A-Z]/.test(content)) matches.push(content);
            });
        }
        console.log("reversedNames:", matches);
        return matches;
    } catch (error) {
        console.error("读取文件时出错:", error);
        return [];
    }
}

const obfuscator = new JavaScriptObfuscator({
    identifierNamesGenerator: "mangled",
    splitStrings: true,
    rotateStringArray: true,
    shuffleStringArray: true,
    stringArray: true,
    simplify: true,
    reservedNames: extractReversedNames(),
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
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true,
                    },
                }),
            ],
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
