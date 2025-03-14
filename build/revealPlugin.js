const gulp = require("gulp");
const webpack = require("webpack-stream");

/**
 * Compile SDAnimation.js to the target folder.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
module.exports = function (targetFolder) {
    const config = getConfiguration();
    return (
        gulp
            // webpack stream
            .src("./Reveal/plugin/SDAnimation.js")
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
            filename: "SDAnimation.js",
            library: "SDAnimation",
            libraryTarget: "umd",
            globalObject: "this",
            libraryExport: "default",
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
