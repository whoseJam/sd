import gulp from "gulp";
import webpack from "webpack-stream";

export default function reveal(targetFolder: string): NodeJS.ReadWriteStream {
  return gulp
    .src("./packages/reveal/src/reveal.ts")
    .pipe(webpack(getConfiguration()))
    .pipe(gulp.dest(targetFolder));
}

function getConfiguration() {
  const mode = global.d ? "development" : "production";
  const watch = global.w ? true : false;
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
