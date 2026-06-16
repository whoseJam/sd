import colors from "colors-console";
import gulp from "gulp";
import ts from "gulp-typescript";

import { parseInput } from "./parser.js";
import { validateJSFile } from "./utils.js";

function create(): ts.Project {
  return ts.createProject("tsconfig.json");
}

export function task(source: string): NodeJS.ReadWriteStream {
  source = source.replaceAll("\\", "/");
  validateJSFile(source);
  const project = create();
  return gulp.src(source).pipe(
    project({
      error: (error) => {
        const diagnostic = error.diagnostic;
        if (diagnostic.file) {
          const { line, character } =
            diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          console.error(
            `${diagnostic.file.fileName} (${line + 1},${character + 1}): ` +
              `Error TS${diagnostic.code}: ${diagnostic.messageText}`,
          );
        }
        return true;
      },
    }),
  );
}

export function launch(selfLaunch = false): NodeJS.ReadWriteStream | undefined {
  if (!import.meta.main && selfLaunch) return;
  parseInput();
  const sourceFilePath = global.i;
  if (!sourceFilePath) {
    console.log(colors("red", "[Error] Please provide the source file path."));
    console.log(colors("cyan", "Usage: type -i <source file path>"));
    process.exit();
  }
  return task(sourceFilePath);
}
