import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseMarkdown, extractVocabulary } from '@glw907/cairn-cms';
import { siteConfig } from '$lib/cairn.config';

const POSTS_DIR = 'src/content/posts';

function tagsInUse(): Set<string> {
	const tags = new Set<string>();
	for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
		const { frontmatter } = parseMarkdown(readFileSync(join(POSTS_DIR, file), 'utf8'));
		for (const tag of (frontmatter.tags as string[] | undefined) ?? []) {
			tags.add(tag);
		}
	}
	return tags;
}

describe('the curated tag vocabulary', () => {
	it('carries exactly the eleven tags the migrated posts use', () => {
		const vocabulary = extractVocabulary(siteConfig);
		const values = vocabulary.map((entry) => entry.value).sort();
		expect(values).toEqual([...tagsInUse()].sort());
		expect(new Set(values).size).toBe(values.length);
	});
});

describe('the Waymark rebuild leaves no orphan files', () => {
	it.each([
		'src/content/pages',
		'static/images/profile.jpg',
		'drizzle',
		'et-book-gh-pages',
	])('%s no longer exists', (path) => {
		expect(existsSync(path)).toBe(false);
	});
});
