import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseMarkdown } from '@glw907/cairn-cms';
import { renderMarkdown } from '$lib/render';

const POSTS_DIR = 'src/content/posts';

// Renders through the real public renderer (src/lib/render.ts, the engine createRenderer output:
// remark-gfm, the sanitize floor, heading slugs, anchor hardening). The snapshot guards the
// published output against accidental drift. It is the same HTML the page and the admin preview emit.
function bodies(dir: string): [string, string][] {
	return readdirSync(dir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => [f, parseMarkdown(readFileSync(join(dir, f), 'utf8')).body]);
}

describe('characterization: 907 rendered HTML through the engine renderer', () => {
	for (const [name, body] of bodies(POSTS_DIR)) {
		it(`renders ${name} identically`, async () => {
			expect(await renderMarkdown(body)).toMatchSnapshot();
		});
	}
});

describe('renderMarkdown sanitize floor', () => {
	it('strips a script tag from authored markdown', async () => {
		const html = await renderMarkdown('Hello\n\n<script>alert(1)</script>');
		expect(html).not.toContain('<script>');
	});

	it('keeps ordinary markdown', async () => {
		const html = await renderMarkdown('# Title\n\nA **bold** word.');
		expect(html).toContain('Title');
		expect(html).toContain('<strong>bold</strong>');
	});
});
