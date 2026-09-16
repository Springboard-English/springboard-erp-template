import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

/**
 * The package's own test config, deliberately a separate file.
 *
 * The consumer apps inline a `test` block in their `vite.config.ts`, which they
 * can because `defineConfig` there builds an application. This package's
 * `vite.config.ts` is a library build (`build.lib`) importing `defineConfig`
 * from `vite`, which has no `test` key at all — so the block has to live here,
 * against `vitest/config`.
 *
 * `environment: "jsdom"` matches all four consumer apps, and the setup file
 * below touches `window` at module scope, so it cannot run under `node`. That
 * does NOT weaken the rule that the pure modules stay DOM-free: the built
 * barrel is imported in bare Node by `scripts/check-node-safe.mjs` on every
 * build, which is a stronger check than a test environment would be. A file
 * that wants to prove something about Node specifically can still opt in with
 * `// @vitest-environment node`.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
