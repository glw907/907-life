// 907.life post frontmatter validation, the site half of the cairn adapter's `validate`.
//
// Mirrors the loose shape posts.ts already reads (title, date, draft, description, tags),
// but enforces it on save so the admin can't commit malformed frontmatter. Unlike ecnordic,
// 907.life tags are FREE-FORM (no controlled vocabulary): any non-empty strings.
//
// The contract returns a `ValidationResult` and never throws: `{ ok: true, data }` on a clean
// frontmatter, or `{ ok: false, errors }` with one message per offending field. The admin
// surfaces the field errors inline rather than bouncing a single thrown message.
import type { ValidationResult } from '@glw907/cairn-cms';
import { dateInputValue } from '@glw907/cairn-cms';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** True when `date` is a real calendar day (round-trips through Date unchanged). */
function isRealCalendarDate(date: string): boolean {
  if (!ISO_DATE.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === date;
}

/**
 * Validate a post's raw frontmatter into the on-disk object. Preserves every prior rule:
 * title and description required, draft a boolean when present, date a real YYYY-MM-DD day,
 * tags an optional free-form list. Returns field-keyed errors instead of throwing.
 */
export function validatePostFrontmatter(
  frontmatter: Record<string, unknown>,
  _body: string,
): ValidationResult {
  const errors: Record<string, string> = {};

  const title = typeof frontmatter.title === 'string' ? frontmatter.title.trim() : '';
  if (!title) errors.title = 'Title is required';

  const description =
    typeof frontmatter.description === 'string' ? frontmatter.description.trim() : '';
  if (!description) errors.description = 'Description is required';

  if (frontmatter.draft !== undefined && typeof frontmatter.draft !== 'boolean') {
    errors.draft = 'Draft must be a boolean';
  }

  const date = dateInputValue(frontmatter.date); // '' when missing/unparseable
  if (!date) {
    errors.date = 'A valid date is required';
  } else if (!isRealCalendarDate(date)) {
    errors.date = `Date "${date}" is not a real calendar date`;
  }

  // Free-form tags: any non-empty strings. Absent is allowed; a non-list is an error.
  const rawTags = frontmatter.tags;
  let tags: string[] = [];
  if (rawTags === undefined || rawTags === null) {
    tags = [];
  } else if (Array.isArray(rawTags)) {
    tags = rawTags.map((t) => String(t).trim()).filter(Boolean);
  } else {
    errors.tags = 'Tags must be a list';
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: { ...frontmatter, title, date, description, tags, draft: frontmatter.draft === true },
  };
}
