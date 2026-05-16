import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/exports.ts', import.meta.url)),
      name: 'SpringboardComponents',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.names?.includes('index.css') ? 'style.css' : (assetInfo.names?.[0] ?? 'asset'),
      },
    }
  },
});
