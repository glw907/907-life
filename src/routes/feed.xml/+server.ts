import type { RequestHandler } from './$types';
import { getFeedItems } from '$lib/feed';
import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION } from '$lib/config';
import { toRFC822 } from '$lib/utils';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const GET: RequestHandler = async () => {
  const items = await getFeedItems();

  const itemsXml = items.map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <pubDate>${toRFC822(item.date)}</pubDate>
      <description>${escapeXml(item.description)}</description>
      <content:encoded><![CDATA[${item.html}]]></content:encoded>
      ${item.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    ${items.length > 0 ? `<lastBuildDate>${toRFC822(items[0].date)}</lastBuildDate>` : ''}
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
};
