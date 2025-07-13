import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // optional
    },
  },
  server: {
    proxy: {
      '/api/proxy-suggest': {
        target: 'https://suggest-maps.yandex.ru',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/proxy-suggest/, '/v1/suggest'),
      },
      '/api': {
        target: 'http://localhost:3000', // backend API porti
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
