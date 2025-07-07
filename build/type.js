const fs = require("fs");
const ts = require("gulp-typescript");
const gulp = require("gulp");
const path = require("path");
const parser = require("./parser");

function create() {
    const project = ts.createProject("tsconfig.json");
    return project;
}

function validateJSFile(sourceFilePath) {
    if (!fs.existsSync(sourceFilePath)) {
        console.log(colors("red", `[Error] File ${sourceFilePath} not found. Please check if the input path is correct.`));
        process.exit();
    }
    if (!sourceFilePath.toLowerCase().endsWith(".js")) {
        console.log(colors("red", `[Error] Invalid file type. The file must be a JavaScript (.js) file.`));
        process.exit();
    }
    try {
        fs.accessSync(sourceFilePath, fs.constants.R_OK);
    } catch (err) {
        console.log(colors("red", `[Error] Cannot read the file. Check file permissions.`));
        process.exit();
    }
}

function task(source) {
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
