const gulp = require("gulp");
const webpack = require("webpack-stream");

/**
 * Compile iframe.js to the target folder.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
module.exports = function (targetFolder) {
    const config = getConfiguration();
    return (
        gulp
            // webpack stream
            .src("./IFrame/IFrame.js")
            .pipe(webpack(config))
            .pipe(gulp.dest(targetFolder))
    );
};

function getConfiguration() {
    const mode = global["d"] ? "development" : "production";
    const watch = global["w"] ? true : false;
    return {
        mode,
        watch,
        output: {
            filename: "iframe.js",
            library: "iframe",
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
            ],
        },
        performance: {
            hints: false,
        },
        cache: true,
    };
}
