import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      $chassis: resolve(__dirname, 'src/chassis'),
      $theme: resolve(__dirname, 'src/theme'),
    },
  },
  test: {
    include: ['src/tests/**/*.test.ts'],
    environment: 'node',
  },
});
