const colors = require("colors-console");
const fs = require("fs");
const path = require("path");

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
    fonts.forEach((font) => {
      if (fs.existsSync(`${dest}/${font}`)) return;
      fs.copyFileSync(`${src}/${font}`, `${dest}/${font}`);
    });
  },
  /**
   * Mirror packages/assets/ into `<dest>/vendor/` so that local builds can
   * load every external dependency (snap.svg, dagre, MathJax2/3, themes,
   * font-awesome, customcontrols, fonts) from the same origin as the deck
   * itself — no whosejam.site or any other CDN required.
   */
  copyVendorAssets(projectRoot, dest) {
    const src = path.join(projectRoot, "packages", "assets");
    if (!fs.existsSync(src)) return;
    const vendorDir = path.join(dest, "vendor");
    // Walk the assets tree and copy everything except node_modules and
    // the package metadata we don't need at runtime.
    const skip = new Set([
      "node_modules",
      "package.json",
      ".npmignore",
      ".gitignore",
      ".travis.yml",
    ]);
    const walk = (s, d) => {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      for (const entry of fs.readdirSync(s, { withFileTypes: true })) {
        if (skip.has(entry.name)) continue;
        const sp = path.join(s, entry.name);
        const dp = path.join(d, entry.name);
        if (entry.isDirectory()) walk(sp, dp);
        else fs.copyFileSync(sp, dp);
      }
    };
    walk(src, vendorDir);
  },
  validateJSFile(src) {
    if (!fs.existsSync(src)) {
      console.log(
        colors(
          "red",
          `[Error] File ${src} not found. Please check if the input path is correct.`,
        ),
      );
      process.exit();
    }
    if (
      !src.toLowerCase().endsWith(".js") &&
      !src.toLowerCase().endsWith(".ts")
    ) {
      console.log(
        colors(
          "red",
          `[Error] Invalid file type. The file must be a JavaScript (.js) or TypeScript (.ts) file.`,
        ),
      );
      process.exit();
    }
    try {
      fs.accessSync(src, fs.constants.R_OK);
    } catch (err) {
      console.log(
        colors("red", `[Error] Cannot read the file. Check file permissions.`),
      );
      process.exit();
    }
  },
};
