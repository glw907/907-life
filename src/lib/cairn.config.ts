// 907.life's cairn adapter. The site-specific half of the CMS (consumer #2): which repo to commit
// to, the one editable concept and its schema, and the engine render the editor preview mirrors.
// One defineFields declaration is the single source of truth for the editor form, the validator,
// and the inferred frontmatter type. 907 uses free-form tags (the open `freetags` field), plain
// prose, and a day-granular dated slug.
import { defineAdapter, defineFields } from '@glw907/cairn-cms';
import { renderMarkdown } from './render.js';
import { siteConfig, SITE_EMAIL } from './config.js';
// The ?url import resolves the compiled stylesheet to its served URL (the hashed asset in a
// build), so the editor's preview frame can link the same sheet the (site) layout loads.
import appCss from '../app.css?url';

export const cairn = defineAdapter({
  siteName: siteConfig.siteName,
  content: {
    posts: {
      dir: 'src/content/posts',
      label: 'Posts',
      schema: defineFields([
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'date', name: 'date', label: 'Date', required: true },
        { type: 'textarea', name: 'description', label: 'Description', required: true, rows: 2 },
        { type: 'freetags', name: 'tags', label: 'Tags' },
        { type: 'boolean', name: 'draft', label: 'Draft (hidden from the live site)' },
      ]),
      summaryFields: ['description'],
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
  render: (md, opts) => renderMarkdown(md, opts),
  // The header menu, managed from /admin/nav and committed to the site-config YAML.
  navMenu: { configPath: 'src/lib/site.config.yaml', menuName: 'primary', label: 'Navigation', maxDepth: 2 },
  // The preview knob. The (site) content region nests main.container.mx-auto.px-4.max-w-3xl.py-8
  // > article.post-detail > div.post-body, and every content rule in app.css is a flat .post-body
  // descendant selector, so the frame needs only the main's classes on body over one post-body
  // container. The post-detail rules are component-scoped to the route and would not match here,
  // so the class is deliberately not reproduced. Posts is the only concept, so no byConcept.
  preview: {
    stylesheets: [appCss],
    bodyClass: 'container mx-auto px-4 max-w-3xl py-8',
    containerClass: 'post-body',
  },
});
