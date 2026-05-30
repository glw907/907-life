// 907.life's cairn adapter. This is the site-specific half of the CMS (consumer #2).
//
// Validates the abstraction on a second design: no slug codec (filename-based ids,
// YYYY-MM-DD-slug), plain markdown preview (no directive pipeline), and free-form tags.
// The engine consumes only this; everything ecnordic-specific stays out. Free-form tags ride
// the `freetags` field type (a comma-separated input → trimmed, de-duplicated list), distinct
// from ecnordic's controlled-vocabulary `tags` checkboxes. The preview reuses the sanitized
// public renderer so the editor sees exactly what the published page renders.
import type { CairnAdapter } from '@glw907/cairn-cms';
import { validatePostFrontmatter } from './content-schema.js';
import { renderPostHtml } from './posts.js';
import { siteConfig, SITE_EMAIL } from './config.js';

export const cairn: CairnAdapter = {
  siteName: siteConfig.siteName,
  content: {
    posts: {
      dir: 'src/content/posts',
      label: 'Posts',
      fields: [
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'date', name: 'date', label: 'Date', required: true },
        { type: 'textarea', name: 'description', label: 'Description', required: true, rows: 2 },
        { type: 'freetags', name: 'tags', label: 'Tags' },
        { type: 'boolean', name: 'draft', label: 'Draft (hidden from the live site)' },
      ],
      validate: validatePostFrontmatter,
    },
  },
  backend: {
    owner: 'glw907',
    repo: '907-life',
    branch: 'main',
    appId: '3847496',
    installationId: '135372268',
  },
  sender: { from: SITE_EMAIL.sender ?? 'noreply@907.life' },
  renderPreview: renderPostHtml,
  // The header menu, managed from /admin/nav and committed to the site-config YAML (Pass L2).
  navMenu: { configPath: 'src/lib/site.config.yaml', menuName: 'primary', label: 'Navigation', maxDepth: 2 },
};
