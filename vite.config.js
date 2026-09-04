import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        scrapbook: resolve(__dirname, 'scrapbook.html'),
        memphis: resolve(__dirname, 'memphis.html'),
        risograph: resolve(__dirname, 'risograph.html')
      }
    }
  }
});
