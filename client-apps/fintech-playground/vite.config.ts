// / <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/client-apps/fintech-playground',
  server: {
    port: 4250,
    host: 'localhost',
  },
  preview: {
    port: 4350,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    outDir: '../../dist/client-apps/fintech-playground',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/client-apps/fintech-playground',
      provider: 'v8',
    },
  },
});
