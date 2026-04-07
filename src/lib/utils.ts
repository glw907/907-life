import { SITE_LOCALE } from '$lib/config';
import type { PostSummary } from '$lib/types';

/**
 * Format an ISO date string (YYYY-MM-DD) as a human-readable date.
 * Parses as UTC to avoid timezone-shift on bare YYYY-MM-DD strings.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.toLocaleDateString(SITE_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Format an ISO date string (YYYY-MM-DD) as a short date (e.g. "Mar 6").
 * Parses as UTC to avoid timezone-shift on bare YYYY-MM-DD strings.
 */
export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.toLocaleDateString(SITE_LOCALE, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Returns the canonical relative URL for a post, e.g. /2026/03/06/early-march/ */
export function postUrl(post: Pick<PostSummary, 'year' | 'month' | 'day' | 'slug'>): string {
  return `/${post.year}/${post.month}/${post.day}/${post.slug}/`;
}

/** Returns the canonical relative URL for a tag page, e.g. /tags/alaska/ */
export function tagUrl(tag: string): string {
  return `/tags/${tag}/`;
}
