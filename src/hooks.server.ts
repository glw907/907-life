import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createAuthGuard } from '@glw907/cairn-cms/sveltekit';

// Inject the saved theme into the SSR'd <html data-theme> so the first paint matches the
// reader's choice with no flash. The engine's auth guard owns /admin gating and runs after.
const theme: Handle = ({ event, resolve }) => {
  const saved = event.cookies.get('theme') ?? '';
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${saved}"`),
  });
};

export const handle = sequence(theme, createAuthGuard());
