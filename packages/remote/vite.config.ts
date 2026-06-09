import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(here, "src/chat"),
  base: "/chat/",
  plugins: [solid()],
  build: {
    outDir: resolve(here, "dist/chat"),
    emptyOutDir: true,
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      input: resolve(here, "src/chat/index.html"),
    },
  },
});
