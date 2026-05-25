import type { LayoutServerLoad } from './$types';
import { cairn } from '$lib/cairn.config';

// The admin surface is dynamic and must never be prerendered, indexed, or Pagefind-crawled
// (overrides the site-wide `prerender = true` for the /admin subtree).
export const prerender = false;

export const load: LayoutServerLoad = ({ locals }) => {
  // siteName flows to every admin page (branding chrome) without pulling the adapter's
  // plugin graph into client bundles — the import stays server-side here.
  return { editor: locals.editor, siteName: cairn.siteName };
};
