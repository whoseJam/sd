const fs = require("fs");
const path = require("path");
const colors = require("colors-console");

module.exports = {
    copyFile(src, dest) {
        const name = path.basename(src);
        console.log("copy ", src, "to ", `${dest}/${name}`);
        fs.copyFileSync(src, `${dest}/${name}`);
    },
    /**
     *
     * @param {*} src
     * @param {*} dest
     */
    copyFolder(src, dest) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) this.copyFolder(srcPath, destPath);
            else this.copyFile(srcPath, dest);
        }
    },
    copyFonts(src, dest) {
        const fonts = ["Consolas.ttf", "Arial.ttf", "Times New Roman.ttf"];
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fonts.forEach(font => {
            if (fs.existsSync(`${dest}/${font}`)) return;
            fs.copyFileSync(`${src}/${font}`, `${dest}/${font}`);
        });
    },
    validateJSFile(src) {
        if (!fs.existsSync(src)) {
            console.log(colors("red", `[Error] File ${src} not found. Please check if the input path is correct.`));
            process.exit();
        }
        if (!src.toLowerCase().endsWith(".js") && !src.toLowerCase().endsWith(".ts")) {
            console.log(
                colors(
                    "red",
                    `[Error] Invalid file type. The file must be a JavaScript (.js) or TypeScript (.ts) file.`
                )
            );
            process.exit();
        }
        try {
            fs.accessSync(src, fs.constants.R_OK);
        } catch (err) {
            console.log(colors("red", `[Error] Cannot read the file. Check file permissions.`));
            process.exit();
        }
    },
};
