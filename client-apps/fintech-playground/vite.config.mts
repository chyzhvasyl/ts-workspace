import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';
import { nxReadySignal } from '@nx/vite/plugins/nx-ready-signal.plugin';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/client-apps/fintech-playground',
  server: {
    port: 4250,
    host: 'localhost',
  },
  preview: {
    port: 4350,
    host: 'localhost',
  },
  plugins: [react(), nxReadySignal()],
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
