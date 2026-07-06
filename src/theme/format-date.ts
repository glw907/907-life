// The one date-stamp formatter for the public site: the entry list, the featured lead, and post
// pages all read a post's ISO `YYYY-MM-DD` date through this, so the long-format wording ("March 6,
// 2026") cannot drift between them.

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Render an ISO `YYYY-MM-DD` date as a long-form label, e.g. "March 6, 2026". */
export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}
