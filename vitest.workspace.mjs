import { defineWorkspace, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineWorkspace([
  defineConfig({
    name: "client",
    root: "./client",
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      include: ["tests/**/*.{test,spec}.{js,jsx}"],
    },
  }),

  defineConfig({
    name: "server",
    root: "./server",
    test: {
      environment: "node",
      globals: true,
      include: ["tests/**/*.{test,spec}.js"],
    },
  }),
]);
