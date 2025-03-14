const path = require("path");
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");

/**
 * Compile all theme css file to the target folder.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
module.exports = function (targetFolder) {
    const themePath = path.join(__dirname, "../Reveal/css/theme");
    const sourcePath = path.join(themePath, "source/**/*.scss");
    return gulp
        .src(sourcePath)
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions", "ie >= 10", "Firefox >= 45", "Chrome >= 45", "Safari >= 10"],
                cascade: true,
                remove: false,
            })
        )
        .pipe(cleanCSS({ compatibility: "ie8", keepSpecialComments: 1 }))
        .pipe(gulp.dest(targetFolder));
};
