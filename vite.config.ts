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
      // Two entries. `transport` exists so a consumer can reach the authed fetch
      // without importing the component library — something in the markdown
      // stack touches `document` at import time, which kills any Node-side test
      // that only wanted to call the API. See src/transport.ts.
      entry: {
        index: fileURLToPath(new URL('./src/exports.ts', import.meta.url)),
        transport: fileURLToPath(new URL('./src/transport.ts', import.meta.url)),
      },
      name: 'SpringboardComponents',
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        assetFileNames: (assetInfo) => assetInfo.name ?? 'asset',
      },
    }
  },
});
