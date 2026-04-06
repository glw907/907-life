/**
 * Format an ISO date string (YYYY-MM-DD) as a human-readable date.
 * Parses as UTC to avoid timezone-shift on bare YYYY-MM-DD strings.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
