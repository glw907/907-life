import type { RequestHandler } from './$types';
import { sitemapResponse, type SitemapUrl } from '@glw907/cairn-cms/delivery';
import { site, posts, ORIGIN } from '$lib/content';

export const prerender = true;

// The concept entries (`site.all()`) plus this site's bespoke routes: /about, /archives, /tags,
// and one page per live tag. None of those four are concept entries, so the site resolver cannot
// see them; they are added here by hand, each tag page carrying the same trailing-slash permalink
// its own route (tags/[tag]) serves.
export const GET: RequestHandler = () => {
  const urls: SitemapUrl[] = [
    { loc: ORIGIN + '/' },
    { loc: ORIGIN + '/about' },
    { loc: ORIGIN + '/archives' },
    { loc: ORIGIN + '/tags' },
    ...posts.allTags().map(({ tag }) => ({ loc: `${ORIGIN}/tags/${tag}/` })),
    ...site.all().map((s) => ({ loc: ORIGIN + s.permalink, ...(s.date ? { lastmod: s.date } : {}) })),
  ];
  return sitemapResponse(urls);
};
