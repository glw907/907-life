// 907.life's cairn adapter — the site-specific half of the CMS (consumer #2).
//
// Validates the abstraction on a second design: no slug codec (filename-based ids,
// YYYY-MM-DD-slug), plain markdown preview (no directive pipeline), and free-form tags.
// cairn-core consumes only this; everything ecnordic-specific stays
// out. The `tags` field is NOT in `fields` because 907.life tags are free-form — the admin
// routes render/parse them as a comma-separated input (see edit/save), so they bypass the
// controlled-vocabulary checkbox the generic field renderer assumes.
import type { CairnAdapter } from 'cairn-cms';
import { validatePostFrontmatter } from './content-schema';

export const cairn: CairnAdapter = {
  siteName: '907.life',
  sender: 'noreply@907.life',
  backend: { owner: 'glw907', repo: '907-life', branch: 'main' },
  // Plain prose preview: Carta's built-in remarkParse → gfm → remark-rehype → stringify
  // mirrors the live remark + remark-gfm + remark-html render (907.life has no directives,
  // so no site plugins are injected).
  preview: { remarkPlugins: [], rehypePlugins: [] },
  collections: [
    {
      type: 'posts',
      label: 'Posts',
      dir: 'src/content/posts',
      fields: [
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'date', name: 'date', label: 'Date', required: true },
        { type: 'textarea', name: 'description', label: 'Description', required: true, rows: 2 },
        { type: 'boolean', name: 'draft', label: 'Draft (hidden from the live site)' },
      ],
      validate: validatePostFrontmatter,
    },
  ],
};
