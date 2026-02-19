import { defineConfig } from 'vite';

// Use the repo-name sub-path when building for production (GitHub Pages).
// In development the root '/' is used so local `vite` works without config.
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/hh3_challenge2/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
