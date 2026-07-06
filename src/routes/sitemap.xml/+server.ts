import type { RequestHandler } from './$types';
import { sitemapResponse, sitemapView, siteDescriptors, type SitemapUrl } from '@glw907/cairn-cms/delivery';
import { site, posts, ORIGIN } from '$chassis/content';
import { EXTRA_ROUTES } from '$theme/site-routes';
import { cairn, siteConfig } from '$theme/cairn.config';

export const prerender = true;

export const GET: RequestHandler = () => {
  const urls: SitemapUrl[] = [
    ...sitemapView(site, siteDescriptors(cairn, siteConfig), ORIGIN, EXTRA_ROUTES),
    // One page per live tag, carrying the trailing-slash permalink its own route (tags/[tag])
    // serves; a tag page is enumerated per tag, so it never joins EXTRA_ROUTES as a static route.
    ...posts.allTags().map(({ tag }) => ({ loc: `${ORIGIN}/tags/${tag}/` })),
  ];
  return sitemapResponse(urls);
};
