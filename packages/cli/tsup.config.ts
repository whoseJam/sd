import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  // bundle=false: emit each src/X.ts as dist/X.js, preserving cross-file
  // imports and shebangs. Bin scripts stay runnable; downstream consumers
  // load the barrel through the exports map.
  bundle: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  shims: false,
  dts: { entry: "src/index.ts" },
});
