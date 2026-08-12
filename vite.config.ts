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
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        assetFileNames: (assetInfo) => assetInfo.name ?? 'asset',
      },
    }
  },
});
