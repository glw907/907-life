// 907.life post frontmatter validation, covering the site half of the cairn adapter's `validate`.
//
// Mirrors the loose shape posts.ts already reads (title, date, draft, description, tags),
// but enforces it on save so the admin can't commit malformed frontmatter. Unlike ecnordic,
// 907.life tags are FREE-FORM (no controlled vocabulary): any non-empty strings.

/** Validated post frontmatter (the on-disk object after type checks). */
export interface PostFrontmatter {
  title: string;
  date: string;
  draft: boolean;
  description: string;
  tags: string[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Coerce a frontmatter date value to an ISO YYYY-MM-DD string (gray-matter yields a Date
 *  for unquoted YAML dates; a quoted/typed string passes straight through). */
function isoFromValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? '');
}

/**
 * Validate a post's raw frontmatter into the on-disk object, throwing on the first problem
 * so the admin bounces a clear message rather than committing bad content. `source` (the
 * filename) is named in every error to make the offending file obvious.
 */
export function validatePostFrontmatter(
  data: Record<string, unknown>,
  source: string,
): PostFrontmatter {
  const fail = (msg: string): never => {
    throw new Error(`Invalid post frontmatter in ${source}: ${msg}`);
  };

  const title = data.title;
  if (typeof title !== 'string' || title.trim() === '') fail('title is required');

  if (data.draft !== undefined && typeof data.draft !== 'boolean') fail('draft must be a boolean');

  const description = data.description;
  if (typeof description !== 'string' || description.trim() === '') fail('description is required');

  const date = isoFromValue(data.date);
  if (!ISO_DATE.test(date)) fail('date must be a YYYY-MM-DD string');
  if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    fail(`date "${date}" is not a real calendar date`);
  }

  // Free-form tags: any non-empty strings. Absent/empty is allowed.
  const rawTags = data.tags ?? [];
  if (!Array.isArray(rawTags)) fail('tags must be a list');
  const tags = (rawTags as unknown[]).map((t) => String(t).trim()).filter(Boolean);

  return {
    title: title as string,
    date,
    draft: data.draft === true,
    description: description as string,
    tags,
  };
}
