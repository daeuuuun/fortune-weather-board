import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/horoscope': {
        target: 'https://ohmanda.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/horoscope\/?/, "/api/horoscope"),
      },
    },
  },
});