const gulp = require("gulp");
const path = require("path");
const through = require("through2");

const URLS_TO_BE_PROCESSED = [
    // urls to be processed
    "./build/**/*",
    "./dist/**/*",
    "./IFrame/**/*",
    "./Reveal/**/*",
    "./SD/**/*",
    ".prettierignore",
    ".prettierrc",
    "package.json",
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

function convertImportPaths(content, filePath, targetPath) {
    const importRegex = /from\s+['"](@[^'"]+)['"]/g;
    const requireRegex = /require\s*\(\s*['"](@[^'"]+)['"]\s*\)/g;
    const getRelativePath = importPath => {
        const purePath = importPath.substring(1);
        const currentDir = path.dirname(filePath);
        const targetPath = path.join("SD", purePath);
        let relativePath = path.relative(currentDir, targetPath).replace(/\\/g, "/");
        return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
    };
    content = content.replace(importRegex, (match, importPath) => {
        return 'from "' + getRelativePath(importPath) + '"';
    });
    content = content.replace(requireRegex, (match, importPath) => {
        return 'require("' + getRelativePath(importPath) + '")';
    });
    return content;
}

module.exports = function (targetPath) {
    return gulp
        .src(URLS_TO_BE_PROCESSED, { base: "." })
        .pipe(
            through.obj(function (file, enc, done) {
                if (file.isNull()) return done(null, file);
                const relativePath = path.relative(global["projectRoot"], file.path);
                if (BLACK_LIST.has(relativePath)) return done(null, null);
                if (file.isBuffer() && relativePath.startsWith("SD")) {
                    console.log(`Converting import of ${relativePath}`);
                    const content = file.contents.toString();
                    file.contents = Buffer.from(convertImportPaths(content, file.path, targetPath));
                }
                return done(null, file);
            })
        )
        .pipe(gulp.dest(targetPath));
};
