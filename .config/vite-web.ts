import tailwindcss from '@tailwindcss/vite';
import path from 'path';
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
        '@': path.resolve(__dirname, '../packages/user-web/src/components'),
        lodash: 'lodash-es',
      },
    },
  });
}
