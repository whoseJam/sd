const fs = require("fs");
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
    copyFonts(src, dest) {
        const fonts = ["Consolas.ttf", "Arial.ttf", "Times New Roman.ttf"];
        fonts.forEach(font => {
            fs.copyFileSync(`${src}/${font}`, `${dest}/${font}`);
        });
    },
};
