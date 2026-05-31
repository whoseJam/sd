import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["test/**/*.test.ts"],
    setupFiles: ["test/setup.ts"],
  },
});
