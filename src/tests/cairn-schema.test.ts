import { describe, it, expect } from 'vitest';
import { cairn } from '$lib/cairn.config';

const schema = cairn.content.posts!.schema;

describe('posts concept schema validation', () => {
  it('accepts a complete post frontmatter', () => {
    const r = schema.validate(
      { title: 'A Day', date: '2026-01-02', description: 'Notes.', tags: ['alaska'], draft: false },
      'body',
    );
    expect(r.ok).toBe(true);
  });

  it('rejects a missing title', () => {
    const r = schema.validate({ date: '2026-01-02', description: 'Notes.' }, 'body');
    expect(r.ok).toBe(false);
  });

  it('rejects a missing description', () => {
    const r = schema.validate({ title: 'A Day', date: '2026-01-02' }, 'body');
    expect(r.ok).toBe(false);
  });

  it('coerces an unquoted-YAML date object to a canonical string', () => {
    const r = schema.validate(
      { title: 'A Day', date: new Date('2026-01-02T00:00:00Z'), description: 'Notes.' },
      'body',
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.date).toBe('2026-01-02');
  });

  it('treats absent free-form tags as optional and omits them from validated data', () => {
    const r = schema.validate({ title: 'A Day', date: '2026-01-02', description: 'Notes.' }, 'body');
    expect(r.ok).toBe(true);
    // The engine deliberately omits an empty freetags list to keep committed frontmatter minimal;
    // the read-model index (createContentIndex/asTags) is what guarantees a [] array downstream.
    if (r.ok) expect(r.data.tags).toBeUndefined();
  });
});
