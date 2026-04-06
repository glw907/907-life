interface PostBase {
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
}

/** Post metadata without rendered HTML — returned by getAllPosts(). */
export type PostSummary = PostBase;

/** Post with rendered HTML — returned by getPost(). */
export type PostDetail = PostBase & { html: string };

/** Union type for contexts that accept either. */
export type Post = PostSummary | PostDetail;
