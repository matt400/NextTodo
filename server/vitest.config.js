import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@server": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    name: "server",
    globals: true,
    environment: "node",
    setupFiles: ["./server/vitest.setup.js"],
    include: ["tests/**/*.{test,spec}.js"],
  },
});
