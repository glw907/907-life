// The one place that maps 907's posts index into cairn-cms/delivery's FeedItem shape. feed.xml and
// feed.json both call this, so the two feed formats read the same permalinks, excerpts, and
// rendered bodies and can never drift from each other.
import { buildLinkResolver, type FeedItem } from '@glw907/cairn-cms/delivery';
import { site, ORIGIN } from '$lib/content';
import { cairn } from '$lib/cairn.config';

/** The feed's item cap; 0 would mean "all posts," but the feed always trims to the newest handful. */
const FEED_MAX_ITEMS = 20;

/** Build 907's post feed items, shared by the RSS and JSON Feed routes. */
export async function buildFeedItems(): Promise<FeedItem[]> {
  const posts = site.concept('posts');
  const toPermalink = buildLinkResolver(site);
  const resolve = (ref: Parameters<typeof toPermalink>[0]) => ORIGIN + toPermalink(ref);
  const all = posts?.all() ?? [];
  const capped = all.slice(0, FEED_MAX_ITEMS);
  return Promise.all(
    capped.map(async (p) => ({
      title: p.title,
      url: ORIGIN + p.permalink,
      date: p.date,
      summary: p.excerpt,
      contentHtml: await cairn.rendering.render({ body: posts!.byId(p.id)!.body, resolve }),
      tags: p.tags,
    })),
  );
}
