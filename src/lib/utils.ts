import { SITE_LOCALE } from '$lib/config';
import type { PostSummary } from '$lib/types';

/**
 * Parse an ISO date string (YYYY-MM-DD) as a UTC Date.
 * Avoids timezone-shift that occurs when Date parses bare YYYY-MM-DD as local time.
 */
function parseUtcDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Format an ISO date string (YYYY-MM-DD) as a human-readable date. */
export function formatDate(iso: string): string {
  return parseUtcDate(iso).toLocaleDateString(SITE_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Format an ISO date string (YYYY-MM-DD) as a short date (e.g. "Mar 6"). */
export function formatShortDate(iso: string): string {
  return parseUtcDate(iso).toLocaleDateString(SITE_LOCALE, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Format an ISO date string (YYYY-MM-DD) as an RFC 822 date (for RSS). */
export function toRFC822(iso: string): string {
  return parseUtcDate(iso).toUTCString();
}

/** Format an ISO date string (YYYY-MM-DD) as an ISO 8601 datetime (for JSON Feed). */
export function toISODateTime(iso: string): string {
  return iso + 'T00:00:00Z';
}

/** Returns the canonical relative URL for a post, e.g. /2026/03/06/early-march/ */
export function postUrl(post: Pick<PostSummary, 'year' | 'month' | 'day' | 'slug'>): string {
  return `/${post.year}/${post.month}/${post.day}/${post.slug}/`;
}

/** Returns the canonical relative URL for a tag page, e.g. /tags/alaska/ */
export function tagUrl(tag: string): string {
  return `/tags/${tag}/`;
}
