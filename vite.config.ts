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
      // One entry, deliberately. The root is safe to import from Node (the
      // markdown renderer is behind a dynamic import), and two entries could
      // emit a module they both need twice — the access token is module state.
      entry: fileURLToPath(new URL('./src/exports.ts', import.meta.url)),
      name: 'SpringboardComponents',
      formats: ['es'],
      fileName: () => 'index.js',
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
      ],
      output: {
        assetFileNames: (assetInfo) => assetInfo.name ?? 'asset',
      },
    }
  },
});
