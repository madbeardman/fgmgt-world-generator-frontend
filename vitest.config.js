/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './vitest.setup.js',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});