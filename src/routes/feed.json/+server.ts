import type { RequestHandler } from './$types';
import { getFeedItems } from '$lib/feed';
import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION, SITE_AUTHOR } from '$lib/config';
import { toISODateTime } from '$lib/utils';

export const GET: RequestHandler = async () => {
  const items = await getFeedItems();

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE_TITLE,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: SITE_DESCRIPTION,
    authors: [{ name: SITE_AUTHOR }],
    items: items.map((item) => ({
      id: item.url,
      url: item.url,
      title: item.title,
      date_published: toISODateTime(item.date),
      summary: item.description,
      content_html: item.html,
      ...(item.tags.length > 0 && { tags: item.tags })
    }))
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
};
