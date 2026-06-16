import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/sd.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  bundle: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  shims: false,
  dts: true,
  // runtime deps stay external so consumers' bundlers resolve them once.
  external: ["@flatten-js/core", "opentype.js", "dagre"],
});
