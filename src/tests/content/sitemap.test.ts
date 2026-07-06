import { describe, it, expect } from 'vitest';
import { unlistedRoutes } from '@glw907/cairn-cms/delivery';
import { GET } from '../../routes/sitemap.xml/+server';
import { posts, site, EXTRA_ROUTES } from '$lib/content';

/** Pull every `<loc>` value out of a sitemap XML document, in document order. */
function locsOf(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// The route ignores its RequestEvent entirely (`GET: RequestHandler = () => {...}`), so a test
// call needs no real event. `RequestHandler`'s declared arity still requires one, hence this cast.
const get = GET as unknown as () => Response;

describe('the sitemap', () => {
  it('carries the four bare site-owned routes, one page per live tag, and every post', async () => {
    const xml = await get().text();
    const locs = locsOf(xml);

    const bare = ['https://907.life/', 'https://907.life/about', 'https://907.life/archives', 'https://907.life/tags'];
    for (const url of bare) expect(locs).toContain(url);

    const tagUrls = posts.allTags().map(({ tag }) => `https://907.life/tags/${tag}/`);
    for (const url of tagUrls) expect(locs).toContain(url);

    const postUrls = site.all().map((entry) => `https://907.life${entry.permalink}`);
    for (const url of postUrls) expect(locs).toContain(url);

    expect(locs.length).toBe(bare.length + tagUrls.length + postUrls.length);
  });

  it('gives every tag page a trailing slash, matching the tags/[tag] route contract', async () => {
    const xml = await get().text();
    const tagLocs = locsOf(xml).filter((loc) => loc.includes('/tags/') && loc !== 'https://907.life/tags');
    expect(tagLocs.length).toBeGreaterThan(0);
    for (const loc of tagLocs) expect(loc.endsWith('/')).toBe(true);
  });
});

describe('the unlisted-route build check', () => {
  it('finds every static page route already accounted for in EXTRA_ROUTES', () => {
    // Globs every +page.svelte in the project, not just the (site) group: parentheses are a glob
    // metacharacter, so a pattern naming the group literally (e.g. /src/routes/(site)/**) matches
    // nothing. Scoping is unnecessary anyway, since the only route outside (site) is
    // /admin/[...path], a dynamic id unlistedRoutes already excludes.
    const pageModules = import.meta.glob('/src/routes/**/+page.svelte');
    const routeIds = Object.keys(pageModules).map((path) =>
      path.replace(/^\/src\/routes/, '').replace(/\/\+page\.svelte$/, ''),
    );
    expect(unlistedRoutes(routeIds, EXTRA_ROUTES)).toEqual([]);
  });
});
