import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // optional
    },
  },
  server: {
    fs: {
      strict: false,
    },
    // 👇 MUHIM: F5 bosilganda frontdagi sahifa ishlashi uchun
    historyApiFallback: true,
    proxy: {
      '/api/proxy-suggest': {
        target: 'https://suggest-maps.yandex.ru',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/proxy-suggest/, '/v1/suggest'),
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  }
});
