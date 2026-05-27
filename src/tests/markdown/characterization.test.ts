import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const POSTS_DIR = 'src/content/posts';

// Mirrors src/lib/posts.ts `getPost`: remark + remark-gfm + remark-html (no rehype).
// 907 keeps this renderer (its output contract differs from cairn-core's rehype pipeline);
// the snapshot guards against accidental drift during the theme-architecture extraction.
function renderMarkdown(body: string): Promise<string> {
	return remark()
		.use(remarkGfm)
		.use(remarkHtml)
		.process(body)
		.then((f) => String(f));
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
