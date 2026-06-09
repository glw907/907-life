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
    // cairn-cms owns CSRF for /admin from 0.35.0: its auth guard validates a __Host-cairn_csrf
    // double-submit token on every admin form POST and keeps a strict Origin check for this site's
    // own non-admin form POSTs. Disable SvelteKit's global check so the JS-free magic-link sign-in,
    // which can arrive without an Origin header, is not rejected by the framework first.
    csrf: { checkOrigin: false },
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
