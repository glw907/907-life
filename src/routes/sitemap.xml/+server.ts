import type { RequestHandler } from './$types';
import { sitemapResponse, type SitemapUrl } from '@glw907/cairn-cms/delivery';
import { site, ORIGIN } from '$lib/content';

export const prerender = true;

// The concept entries only, for now. The bespoke routes this site adds on top of the engine
// (/about, /archives, /tags, and the per-tag pages) are not concept entries, so `site.all()`
// cannot see them; a later pass adds them here once those routes exist.
export const GET: RequestHandler = () => {
  const urls: SitemapUrl[] = [
    { loc: ORIGIN + '/' },
    ...site.all().map((s) => ({ loc: ORIGIN + s.permalink, ...(s.date ? { lastmod: s.date } : {}) })),
  ];
  return sitemapResponse(urls);
};
