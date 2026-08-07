import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    strictPort: true,
  },
  resolve: {
    alias: {
      lodash: 'lodash-es',
    },
  },
});
