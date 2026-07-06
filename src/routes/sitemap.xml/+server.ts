import type { RequestHandler } from './$types';
import { sitemapResponse, sitemapView, siteDescriptors, type SitemapUrl } from '@glw907/cairn-cms/delivery';
import { site, posts, ORIGIN } from '$lib/content';
import { cairn, siteConfig } from '$lib/cairn.config';

export const prerender = true;

// The four bare site-owned routes the site resolver cannot see, since none is a concept entry:
// /, /about, /archives, /tags. sitemapView folds these in ahead of every concept url. The
// unlisted-route test (src/tests/content/sitemap.test.ts) fails the build if a route directory
// under (site) ever drifts out of sync with this list.
export const EXTRA_ROUTES = ['/', '/about', '/archives', '/tags'];

export const GET: RequestHandler = () => {
  const urls: SitemapUrl[] = [
    ...sitemapView(site, siteDescriptors(cairn, siteConfig), ORIGIN, EXTRA_ROUTES),
    // One page per live tag, carrying the trailing-slash permalink its own route (tags/[tag])
    // serves; a tag page is enumerated per tag, so it never joins EXTRA_ROUTES as a static route.
    ...posts.allTags().map(({ tag }) => ({ loc: `${ORIGIN}/tags/${tag}/` })),
  ];
  return sitemapResponse(urls);
};
