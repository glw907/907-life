import { getAllPosts, getPost } from '$lib/posts';
import { FEED_MAX_ITEMS, SITE_URL } from '$lib/config';
import { postUrl } from '$lib/utils';

export interface FeedItem {
  title: string;
  url: string;
  date: string;
  description: string;
  html: string;
  tags: string[];
}

let _cachedFeed: FeedItem[] | null = null;

/**
 * Returns feed items newest-first, up to FEED_MAX_ITEMS (0 = all).
 * Memoized: post content is bundled at build time and never changes at runtime.
 */
export async function getFeedItems(): Promise<FeedItem[]> {
  if (_cachedFeed) return _cachedFeed;

  let posts = getAllPosts();
  if (FEED_MAX_ITEMS > 0) {
    posts = posts.slice(0, FEED_MAX_ITEMS);
  }

  _cachedFeed = await Promise.all(
    posts.map(async (post) => {
      const detail = await getPost(post.year, post.month, post.day, post.slug);
      return {
        title: post.title,
        url: SITE_URL + postUrl(post),
        date: post.date,
        description: post.description,
        html: detail?.html ?? '',
        tags: post.tags
      };
    })
  );

  return _cachedFeed;
}
