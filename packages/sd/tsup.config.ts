import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  bundle: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  shims: false,
  dts: true,
  external: ["@whosejam/sd-core", "@whosejam/sd-layout"],
});
