import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import gulpSassFactory from "gulp-sass";
import path from "node:path";
import sassCompiler from "sass";

const sass = gulpSassFactory(sassCompiler);

export default function theme(targetFolder: string): NodeJS.ReadWriteStream {
  const themePath = path.join(
    import.meta.dirname,
    "../../reveal/src/css/theme",
  );
  const sourcePath = path.join(themePath, "source/**/*.scss");
  return gulp
    .src(sourcePath)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: [
          "last 5 versions",
          "ie >= 10",
          "Firefox >= 45",
          "Chrome >= 45",
          "Safari >= 10",
        ],
        cascade: true,
        remove: false,
      }),
    )
    .pipe(cleanCSS({ compatibility: "ie8", keepSpecialComments: 1 }))
    .pipe(gulp.dest(targetFolder));
}
