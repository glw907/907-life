import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { renderPostHtml } from '$lib/posts';

const POSTS_DIR = 'src/content/posts';

// Renders through the real public renderer (src/lib/posts.ts `renderPostHtml`: remark + gfm
// → remark-rehype → rehype-sanitize → stringify). The snapshot guards the published output
// against accidental drift; it is the same HTML the page and the admin preview emit.
function renderMarkdown(body: string): Promise<string> {
	return renderPostHtml(body);
}

function bodies(dir: string): [string, string][] {
	return readdirSync(dir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => [f, matter(readFileSync(join(dir, f), 'utf8')).content]);
}

describe('characterization: current 907 rendered HTML is preserved', () => {
	for (const [name, body] of bodies(POSTS_DIR)) {
		it(`renders ${name} identically`, async () => {
			expect(await renderMarkdown(body)).toMatchSnapshot();
		});
	}
});

describe('renderPostHtml sanitize floor', () => {
	it('strips a script tag from authored markdown', async () => {
		const html = await renderPostHtml('Hello\n\n<script>alert(1)</script>');
		expect(html).not.toContain('<script>');
	});

	it('keeps ordinary markdown', async () => {
		const html = await renderPostHtml('# Title\n\nA **bold** word.');
		expect(html).toContain('<h1>Title</h1>');
		expect(html).toContain('<strong>bold</strong>');
	});
});
