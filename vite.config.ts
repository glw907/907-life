import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { cairnManifest } from '@glw907/cairn-cms/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    // Verify the committed content manifest against the corpus on every build, back the
    // cairn-manifest regenerate bin, and expose the adapter so cairn-doctor self-derives the
    // sending domain, HTTPS/HSTS, and GitHub App checks. Posts is the only concept.
    cairnManifest({
      configModule: '/src/theme/cairn.config.ts',
      content: { posts: '/src/content/posts/*.md' },
      manifestPath: '/src/content/.cairn/index.json',
    }),
  ],
  ssr: {
    external: ['cloudflare:email']
  },
  build: {
    rollupOptions: {
      external: ['cloudflare:email']
    }
  }
});
