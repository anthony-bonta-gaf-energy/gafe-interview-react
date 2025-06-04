import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export function defineWeb() {
  return defineConfig({
    plugins: [tsConfigPaths(), tailwindcss()],
    server: {
      strictPort: true,
    },
    resolve: {
      alias: {
        lodash: 'lodash-es',
      },
    },
  });
}
