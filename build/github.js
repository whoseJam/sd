const gulp = require("gulp");
const path = require("path");
const through = require("through2");
const stripComments = require("gulp-strip-comments");

const URLS_TO_BE_PROCESSED = [
    // urls to be processed
    "./build/**/*",
    "./dist/**/*",
    "./example/**/*",
    "./IFrame/**/*",
    "./Reveal/**/*",
    "./SD/**/*",
    ".gitignore",
    ".prettierignore",
    ".prettierrc",
    "gulpfile.js",
    "jsconfig.json",
    "package.json",
    "README.md",
];

const BLACK_LIST = new Set([
    // black list
    "SD\\Animate\\Action.js",
    "SD\\Animate\\ActionList.js",
    "SD\\Animate\\Animate.js",
    "SD\\Animate\\Context.js",
    "SD\\Animate\\Interp.js",
    "SD\\Animate\\Window.js",
    "SD\\Interact\\Init.js",
    "SD\\Node\\Core\\Reactive_naive.js",
    "SD\\Node\\Core\\Reactive_change.js",
    "SD\\Node\\Core\\Reactive_dag.js",
    "SD\\sd.js",
    "build\\github.js",
    "build\\rag.js",
    "build\\release.js",
]);

module.exports = function (targetPath) {
    return gulp
        .src(URLS_TO_BE_PROCESSED, { base: "." })
        .pipe(
            through.obj(function (file, enc, done) {
                if (file.isNull()) return done(null, file);
                const relativePath = path.relative(global["projectRoot"], file.path);
                if (BLACK_LIST.has(relativePath)) return done(null, null);
                if (relativePath.startsWith("SD")) file.__removeComments = true;
                done(null, file);
            })
        )
        .pipe(
            through.obj(function (file, enc, done) {
                if (!file.__removeComments) {
                    done(null, file);
                } else {
                    const stripStream = stripComments();
                    stripStream.write(file);
                    stripStream.once("data", processedFile => {
                        done(null, processedFile);
                    });
                }
            })
        )
        .pipe(gulp.dest(targetPath));
};
