import colors from "colors-console";
import fs from "node:fs";
import path from "node:path";

export function copyFile(src: string, dest: string): void {
  const name = path.basename(src);
  console.log("copy ", src, "to ", `${dest}/${name}`);
  fs.copyFileSync(src, `${dest}/${name}`);
}

export function copyFolder(src: string, dest: string): void {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyFolder(srcPath, destPath);
    else copyFile(srcPath, dest);
  }
}

export function copyFonts(src: string, dest: string): void {
  const fonts = ["Consolas.ttf", "Arial.ttf", "Times New Roman.ttf"];
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);
  for (const font of fonts) {
    if (fs.existsSync(`${dest}/${font}`)) continue;
    fs.copyFileSync(`${src}/${font}`, `${dest}/${font}`);
  }
}

// Mirror packages/assets/ into `<dest>/vendor/` so local builds load every
// external dep (dagre, MathJax2/3, themes, font-awesome, customcontrols, fonts)
// from the same origin as the deck itself — no CDN required.
export function copyVendorAssets(projectRoot: string, dest: string): void {
  const src = path.join(projectRoot, "packages", "assets");
  if (!fs.existsSync(src)) return;
  const vendorDir = path.join(dest, "vendor");
  const skip = new Set([
    "node_modules",
    "package.json",
    ".npmignore",
    ".gitignore",
    ".travis.yml",
  ]);
  const walk = (s: string, d: string): void => {
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
}

export function validateJSFile(src: string): void {
  if (!fs.existsSync(src)) {
    console.log(
      colors(
        "red",
        `[Error] File ${src} not found. Please check if the input path is correct.`,
      ),
    );
    process.exit();
  }
  const lower = src.toLowerCase();
  if (!lower.endsWith(".js") && !lower.endsWith(".ts")) {
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
  } catch {
    console.log(
      colors("red", `[Error] Cannot read the file. Check file permissions.`),
    );
    process.exit();
  }
}
