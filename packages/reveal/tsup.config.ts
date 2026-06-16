import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/reveal.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  bundle: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  shims: false,
  dts: true,
  external: [
    "@whosejam/sd-assets",
    "@whosejam/sd-element",
    "@whosejam/sd-include-html",
    "reveal.js",
  ],
});
