const ts = require("gulp-typescript");
const gulp = require("gulp");
const path = require("path");
const utils = require("./utils");
const parser = require("./parser");

function create() {
    const project = ts.createProject("tsconfig.json");
    return project;
}

function task(source) {
    source = source.replaceAll("\\", "/");
    utils.validateJSFile(source);
    const project = create();
    return gulp.src(source).pipe(
        project({
            error: (error, typescript) => {
                const diagnostic = error.diagnostic;
                if (diagnostic.file) {
                    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ` + `Error TS${diagnostic.code}: ${diagnostic.messageText}`);
                }
                return true;
            },
        })
    );
}

function launch(selfLaunch = false) {
    if (require.main !== module && selfLaunch) return;
    if (require.main === module) global["projectRoot"] = path.resolve(__dirname, "..");
    parser.parseInput();
    const sourceFilePath = global["i"];
    if (!sourceFilePath) {
        console.log(colors("red", "[Error] Please provide the source file path."));
        console.log(colors("cyan", "Usage: type -i <source file path>"));
        process.exit();
    }
    return task(sourceFilePath);
}

module.exports = {
    task,
    launch,
};
