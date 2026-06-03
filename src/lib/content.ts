// The site's one delivery content layer. Everything public (home, tags, feeds, sitemap, the
// catch-all route) reads content through here. It globs the posts, hands the adapter to
// createSiteIndexes for the typed index and the site resolver, verifies the committed manifest
// against the corpus, and exposes the build link resolver for cairn: tokens.
import {
  createSiteIndexes,
  buildLinkResolver,
  buildSiteManifest,
  type FeedItem,
} from '@glw907/cairn-cms/delivery';
import { parseSiteConfig, verifyManifest } from '@glw907/cairn-cms';
import { cairn } from './cairn.config.js';
import siteYaml from './site.config.yaml?raw';
import manifestRaw from '/src/content/.cairn/index.json?raw';
import { SITE_URL, SITE_DESCRIPTION as DESC, FEED_MAX_ITEMS } from './config.js';

const postsRaw = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const siteConfig = parseSiteConfig(siteYaml);
const indexes = createSiteIndexes(cairn, siteConfig, { posts: postsRaw });

// Fail the build if the committed manifest drifted from the corpus. Regenerate with
// `npm run cairn:manifest`.
verifyManifest(buildSiteManifest(cairn, siteConfig, { posts: postsRaw }), manifestRaw);

export const site = indexes.site;
export const posts = indexes.posts;
export const ORIGIN = SITE_URL;
export const SITE_DESCRIPTION = DESC;

/** A post as the home and archive lists render it: the engine summary plus the authored
 *  description, surfaced on the summary via the concept's summaryFields. */
export interface PostListItem {
  id: string;
  slug: string;
  permalink: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
}

/** Map a summary to a PostListItem, reading the authored description off the summary's fields. */
function toItem(s: {
  id: string;
  slug: string;
  permalink: string;
  title: string;
  date?: string;
  tags: string[];
  fields: Record<string, unknown>;
}): PostListItem {
  return {
    id: s.id,
    slug: s.slug,
    permalink: s.permalink,
    title: s.title,
    date: s.date ?? '',
    tags: s.tags,
    description: (s.fields.description as string) ?? '',
  };
}

/** All non-draft posts, newest first, as the home and archive lists consume them. */
export function postList(): PostListItem[] {
  return posts.all().map(toItem);
}

/** Non-draft posts carrying the given tag, newest first, as list items. */
export function postListByTag(tag: string): PostListItem[] {
  return posts.byTag(tag).map(toItem);
}

/** The resolver the render threads so cairn: links resolve to live permalinks at build. */
export const linkResolver = buildLinkResolver(site);

/** Posts as feed entries, newest first, capped at FEED_MAX_ITEMS (0 means all). Both feed routes
 *  render from this one list so they never drift. The summary is the authored description. */
export function feedItems(): Promise<FeedItem[]> {
  const all = posts.all();
  const capped = FEED_MAX_ITEMS > 0 ? all.slice(0, FEED_MAX_ITEMS) : all;
  return Promise.all(
    capped.map(async (p) => {
      const entry = posts.byId(p.id)!;
      return {
        title: p.title,
        url: SITE_URL + p.permalink,
        date: p.date ?? '',
        summary: (p.fields.description as string) ?? '',
        contentHtml: await cairn.render(entry.body, { resolve: linkResolver }),
        tags: p.tags,
      };
    }),
  );
}
