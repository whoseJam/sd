import { cpSync } from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/element.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  bundle: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  shims: false,
  dts: true,
  async onSuccess() {
    cpSync("src/template.html", "dist/template.html");
  },
});
