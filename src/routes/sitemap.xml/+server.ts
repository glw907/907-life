import type { RequestHandler } from './$types';
import { sitemapResponse, type SitemapUrl } from '@glw907/cairn-cms/delivery';
import { site, posts } from '$lib/content';
import { SITE_URL } from '$lib/config';

export const prerender = true;

export const GET: RequestHandler = () => {
  const urls: SitemapUrl[] = [
    { loc: SITE_URL + '/' },
    { loc: SITE_URL + '/about' },
    { loc: SITE_URL + '/archives' },
    { loc: SITE_URL + '/tags' },
    ...site.all().map((s) => {
      const loc = SITE_URL + s.permalink;
      return s.date ? { loc, lastmod: s.date } : { loc };
    }),
    ...posts.allTags().map(({ tag }) => ({ loc: `${SITE_URL}/tags/${tag}/` })),
  ];

  return sitemapResponse(urls);
};
