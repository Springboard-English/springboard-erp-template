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
      // One entry again. A second, DOM-free `transport` entry existed only
      // because the markdown renderer touched `document` while this package was
      // being imported; that is now behind a dynamic import, so the root is safe
      // to import from Node and the split has nothing left to buy — while two
      // entries carried a real hazard, since a module they both need can be
      // emitted twice, and the access token is module state.
      entry: fileURLToPath(new URL('./src/exports.ts', import.meta.url)),
      name: 'SpringboardComponents',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      // Anything whose API is a React CONTEXT must be external, or the package
      // gets its own copy and reads a context the app never provided.
      // `@tanstack/react-query` was not on this list, so bundling it was
      // harmless right up until a component here called `useQueryClient` —
      // GlobalStatusQueryBridge — and every HRM page died with "No QueryClient
      // set" while the app's provider sat right above it.
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
      ],
      output: {
        assetFileNames: (assetInfo) => assetInfo.name ?? 'asset',
      },
    }
  },
});
