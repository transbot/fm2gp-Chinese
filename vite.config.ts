/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { seoPlugin } from './src/seo/buildPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
  },
  plugins: [react(), seoPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
