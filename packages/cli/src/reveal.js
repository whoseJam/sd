const gulp = require("gulp");
const webpack = require("webpack-stream");

const utils = require("./utils");

/**
 * Compile myreveal.js to the target folder.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
module.exports = function (targetFolder) {
  const config = getConfiguration();
  return (
    gulp
      // webpack stream
      .src("./packages/reveal/src/Reveal.ts")
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
      filename: "myreveal.js",
      library: "MyReveal",
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: "this",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: { loader: "babel-loader" },
        },
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                allowJs: true,
                target: "ES6",
                module: "ESNext",
                moduleResolution: "Node",
                strict: false,
                skipLibCheck: true,
              },
              transpileOnly: true,
            },
          },
        },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    performance: {
      hints: false,
    },
    cache: true,
  };
}
