export interface Post {
  /** URL slug, e.g. "early-march" (filename minus date prefix) */
  slug: string;
  /** Four-digit year string, e.g. "2026" */
  year: string;
  /** Zero-padded month string, e.g. "03" */
  month: string;
  /** Zero-padded day string, e.g. "06" */
  day: string;
  title: string;
  /** ISO date string from frontmatter, e.g. "2026-03-06" */
  date: string;
  draft: boolean;
  description: string;
  tags: string[];
  /** Rendered HTML — only present when loaded via getPost() */
  html?: string;
}
