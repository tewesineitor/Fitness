
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('recharts')) {
            return 'vendor-recharts';
          }

          if (id.includes('@google/genai')) {
            return 'vendor-genai';
          }

          if (id.includes('@zxing/browser')) {
            return 'vendor-zxing';
          }

          if (
            id.includes('react-dom') ||
            id.includes('/react/') ||
            id.includes('\\react\\')
          ) {
            return 'vendor-react';
          }

          return undefined;
        },
      },
    },
  },
});
