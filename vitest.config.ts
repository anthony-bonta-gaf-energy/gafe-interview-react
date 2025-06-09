import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environment: 'jsdom',
    testTimeout: 30000,
    globals: true,
    coverage: {
      all: false,
      provider: 'istanbul',
    },
  },
});
