import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  server: {
    strictPort: true,
  },
  resolve: {
    alias: {
      lodash: 'lodash-es',
    },
  },
});
