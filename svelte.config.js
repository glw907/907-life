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
      // A 5xx during prerender means a page actually crashed, so fail the build. This makes the
      // content graph fail-closed: a dangling cairn: link target throws "cairn link target not
      // found" out of the render, the page 500s, and the build stops here instead of shipping a
      // broken page. A 4xx (a link to a missing path) stays a warning, the lenient default.
      handleHttpError: ({ status, message }) => {
        if (status >= 500) throw new Error(message);
        console.warn(message);
      },
      handleMissingId: 'warn'
    }
  }
};

export default config;
