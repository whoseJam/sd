const gulp = require("gulp");

module.exports = {
    /**
     * @param {string} src
     * @param {string} dest
     * @returns {NodeJS.ReadWriteStream}
     */
    copyFile(src, dest) {
        return gulp.src(src).pipe(gulp.dest(dest));
    },
};
