import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md', '.svx']
    })
  ],
  kit: {
    // remoteBindings:false keeps the build-time platform proxy from connecting to Cloudflare
    // during prerender. The EMAIL binding is `remote = true` for `wrangler dev` real-mail only;
    // wrangler dev still honors it, but without this the CI prerender (no Cloudflare auth) fails
    // with "Failed to start the remote proxy session".
    adapter: adapter({ platformProxy: { remoteBindings: false } }),
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    }
  }
};

export default config;
