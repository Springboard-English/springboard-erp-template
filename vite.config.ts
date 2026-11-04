import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      // Both entries go through this one build, so a module they share lands in
      // one chunk: the access token is module state and must never exist twice.
      // The root is safe to import from Node (the markdown renderer is behind a
      // dynamic import).
      entry: {
        index: fileURLToPath(new URL('./src/exports.ts', import.meta.url)),
        core: fileURLToPath(new URL('./src/core/index.ts', import.meta.url)),
        exercise: fileURLToPath(new URL('./src/exercise/index.ts', import.meta.url)),
        'test-setup': fileURLToPath(new URL('./src/test/setup.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // Anything whose API is a React CONTEXT must be external, or the package
      // gets its own copy and reads a context the app never provided — e.g.
      // `useQueryClient` in GlobalStatusQueryBridge would throw "No QueryClient
      // set" with the app's provider right above it.
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        // The exercise model's schemas: an app composes them with its own `z`,
        // so both must be the same copy. Only `/exercise` imports it.
        'zod',
        // The app's own test runner, which `test-setup` must share with it.
        'vitest',
        /^@testing-library\//,
      ],
      output: {
        assetFileNames: (assetInfo) => assetInfo.name ?? 'asset',
      },
    }
  },
});
