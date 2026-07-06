// 907.life's one delivery content layer. Everything public (home, the catch-all route, the feeds,
// the sitemap) reads content through here. It globs the posts and hands the adapter to the engine's
// full-auto createSiteIndexes, which builds the typed index and the cross-concept site resolver.
// The cairnManifest() Vite plugin owns the build-time manifest verify (it runs outside the
// prerender lifecycle, so a stale manifest fails the build red regardless of the handleHttpError
// policy), so this module does not re-check it.
import { createSiteIndexes } from '@glw907/cairn-cms/delivery';
import { cairn, siteConfig } from './cairn.config.js';

const postsRaw = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const indexes = createSiteIndexes(cairn, siteConfig, { posts: postsRaw });

export const site = indexes.site;
export const posts = indexes.posts;

/** The canonical origin, never read from a request header (used by the sitemap, feeds, and SEO). */
export const ORIGIN = 'https://907.life';

export const SITE_DESCRIPTION = siteConfig.description ?? '';

// The four bare site-owned routes the site resolver cannot see, since none is a concept entry:
// /, /about, /archives, /tags. sitemapView folds these in ahead of every concept url, and the
// unlisted-route test (src/tests/content/sitemap.test.ts) fails the build if a route directory
// under (site) ever drifts out of sync with this list. Lives here, not in the sitemap route
// module, since a +server.ts export must be one of SvelteKit's own recognized route exports.
export const EXTRA_ROUTES = ['/', '/about', '/archives', '/tags'];
