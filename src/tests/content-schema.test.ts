import { describe, it, expect } from 'vitest';
import { validatePostFrontmatter } from '$lib/content-schema';

describe('validatePostFrontmatter (ValidationResult)', () => {
  it('rejects a missing title with a field error, no throw', () => {
    const result = validatePostFrontmatter(
      { date: '2026-05-29', description: 'x' },
      'body',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.title).toBeTruthy();
  });

  it('rejects a missing description (preserved rule)', () => {
    const result = validatePostFrontmatter({ title: 'Hi', date: '2026-05-29' }, 'body');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.description).toBeTruthy();
  });

  it('rejects a non-boolean draft (preserved rule)', () => {
    const result = validatePostFrontmatter(
      { title: 'Hi', date: '2026-05-29', description: 'x', draft: 'yes' },
      'body',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.draft).toBeTruthy();
  });

  it('rejects an impossible calendar date (preserved rule)', () => {
    const result = validatePostFrontmatter(
      { title: 'Hi', date: '2026-13-45', description: 'x' },
      'body',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.date).toBeTruthy();
  });

  it('rejects a non-list tags value (preserved rule)', () => {
    const result = validatePostFrontmatter(
      { title: 'Hi', date: '2026-05-29', description: 'x', tags: 'nope' },
      'body',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.tags).toBeTruthy();
  });

  it('accepts a valid post and returns normalized data', () => {
    const result = validatePostFrontmatter(
      {
        title: '  Hi  ',
        date: '2026-05-29',
        description: 'A description.',
        tags: ['a', ' b '],
        draft: false,
      },
      'body',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe('Hi');
      expect(result.data.tags).toEqual(['a', 'b']);
      expect(result.data.draft).toBe(false);
    }
  });

  it('coerces an unquoted YAML Date to an ISO string', () => {
    const result = validatePostFrontmatter(
      { title: 'Hi', date: new Date('2026-05-29T00:00:00Z'), description: 'x' },
      'body',
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.date).toBe('2026-05-29');
  });
});
