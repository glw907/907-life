import { getAllPosts, getPost } from '$lib/posts';
import { FEED_MAX_ITEMS, SITE_URL } from '$lib/config';
import { postUrl } from '$lib/utils';

export interface FeedItem {
  title: string;
  /** Absolute URL: SITE_URL + postUrl(post) */
  url: string;
  /** ISO date string from frontmatter, e.g. "2026-03-06" */
  date: string;
  description: string;
  /** Full rendered HTML from getPost() */
  html: string;
  tags: string[];
}

/**
 * Fetches all feed items, newest-first. Respects FEED_MAX_ITEMS (0 = all).
 * Renders full HTML for each post via getPost().
 */
export async function getFeedItems(): Promise<FeedItem[]> {
  let posts = getAllPosts();
  if (FEED_MAX_ITEMS > 0) {
    posts = posts.slice(0, FEED_MAX_ITEMS);
  }

  return Promise.all(
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
}
