import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createAuthGuard } from '@glw907/cairn-cms/sveltekit';

// The two themes the site ships (app.css @plugin "daisyui"). The cookie value is interpolated
// into an HTML attribute below, so anything outside this set must never reach the template:
// an attacker-written cookie (plain-http Set-Cookie before HSTS, or a future subdomain) would
// otherwise break out of the attribute on every SSR'd page, the admin included.
const THEMES = new Set(['silk', 'dim']);

// Inject the saved theme into the SSR'd <html data-theme> so the first paint matches the
// reader's choice with no flash. The engine's auth guard owns /admin gating and runs after.
const theme: Handle = ({ event, resolve }) => {
  const cookie = event.cookies.get('theme') ?? '';
  const saved = THEMES.has(cookie) ? cookie : '';
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${saved}"`),
  });
};

export const handle = sequence(theme, createAuthGuard());
