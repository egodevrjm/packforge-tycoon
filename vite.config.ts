import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@packforge/packs/coffee-shop",
        replacement: resolve(__dirname, "packages/packs/src/coffee-shop/index.ts")
      },
      {
        find: "@packforge/packs/game-studio",
        replacement: resolve(__dirname, "packages/packs/src/game-studio/index.ts")
      },
      {
        find: "@packforge/packs/space-colony",
        replacement: resolve(__dirname, "packages/packs/src/space-colony/index.ts")
      },
      {
        find: "@packforge/packs/scrapyard",
        replacement: resolve(__dirname, "packages/packs/src/scrapyard/index.ts")
      },
      {
        find: "@packforge/core",
        replacement: resolve(__dirname, "packages/core/src/index.ts")
      },
      {
        find: "@packforge/packs",
        replacement: resolve(__dirname, "packages/packs/src/index.ts")
      },
      {
        find: "@packforge/builder-kit",
        replacement: resolve(__dirname, "packages/builder-kit/src/index.ts")
      }
    ]
  },
  server: {
    port: 5173
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**"]
  }
});
