// 907.life's cairn adapter (v2 idiom, the Waymark rebuild). The site-specific half of the CMS
// (consumer #2): which repo to commit to, the one concept and its fieldset, and the entry-aware
// render the editor preview mirrors. 907 has no directive components, straight prose only, so the
// render pipeline runs an empty registry.
import {
  defineAdapter,
  defineConcept,
  fieldset,
  fields,
  githubApp,
  defineRegistry,
  parseSiteConfig,
} from '@glw907/cairn-cms';
import { normalizeAssets, makeMediaResolver, readCommittedManifest } from '@glw907/cairn-cms/media';
import { renderMarkdown } from './render.js';
import { wrapScrollableTables } from './render/table-scroll.js';
import siteYaml from './site.config.yaml?raw';
// The ?url import resolves the compiled stylesheets to their served URLs (the hashed assets in a
// build), so the editor's preview frame links the same sheets the (site) layout loads. They must
// stay ?url-only; see the header comment in site.css.
import themeCss from './theme.css?url';
import siteCss from './site.css?url';

// The cairn-manifest bin, the cairnManifest() Vite plugin, and cairn-doctor read the adapter and
// the parsed site config off one module, so re-export siteConfig here to make this file that
// single configModule.
export const siteConfig = parseSiteConfig(siteYaml);

// The committed media manifest the public render resolver reads. Starts as {} until an editor
// uploads; a glob with no match returns {} instead of failing the build (unlike a static import
// of an absent file, which fails at build time before any runtime degrade can run).
const mediaManifest = readCommittedManifest(
  import.meta.glob('../content/.cairn/media.json', { eager: true, import: 'default' }),
);

// The default public media resolver, backing the public build over the committed manifest. The
// admin preview injects its own resolver from the edit page's mediaTargets; this only backs the
// published build, so a `media:` reference rewrites to its content-addressed /media URL.
const resolvedAssets = normalizeAssets({ bucketBinding: 'MEDIA_BUCKET' });
export const publicMediaResolver = makeMediaResolver(mediaManifest, resolvedAssets);

// Whether media is configured on, threaded as `assetsEnabled` to the public catch-all route so the
// engine logs `media.resolver_absent` rather than silently dropping a hero image if a future edit
// forgets to wire resolveMedia while media stays on.
export const mediaEnabled = resolvedAssets.enabled;

export const cairn = defineAdapter({
  content: {
    posts: defineConcept({
      dir: 'src/content/posts',
      label: 'Posts',
      routing: 'feed',
      permalink: '/:year/:month/:day/:slug',
      datePrefix: 'day',
      summaryFields: ['description'],
      fields: fieldset({
        title: fields.text({ label: 'Title', required: true }),
        date: fields.date({ label: 'Date' }),
        description: fields.textarea({ label: 'Description', required: true }),
        // The taxonomy marker: a closed, vocabulary-sourced picker once site.config.yaml declares
        // `vocabulary` (an open creatable tag input until then), surfacing on ContentSummary.tags
        // and the feed categories.
        tags: fields.multiselect({ label: 'Tags', creatable: true, taxonomy: true }),
        draft: fields.boolean({ label: 'Draft (hidden from the live site)' }),
      }),
    }),
  },
  backend: githubApp({
    owner: 'glw907',
    repo: '907-life',
    branch: 'main',
    appId: '3847496',
    installationId: '135372268',
  }),
  email: { from: 'noreply@907.life' },
  // Media on: the R2 bucket binding (wrangler.toml) the upload, storage, delivery, and resolver
  // paths read. Cloudflare Images transforms stay off (the default), so the site serves full-size
  // bytes until the zone opts in.
  media: { bucketBinding: 'MEDIA_BUCKET' },
  rendering: {
    // The entry-aware render: the editor preview and every public page call this one function.
    // The default media resolver backs the public build; the preview path injects its own. Render
    // through the engine, then run 907's own rehype step (wrapScrollableTables) over the result:
    // createRenderer keeps its internal plugin ordering closed, so a site adds its own post-render
    // behavior at the HTML-string boundary instead (the cairn showcase's table-scroll pattern).
    render: async ({ body, resolve, resolveMedia }) => {
      const html = await renderMarkdown(body, { resolve, resolveMedia: resolveMedia ?? publicMediaResolver });
      return wrapScrollableTables(html);
    },
    components: defineRegistry({ components: [] }),
  },
  editor: {
    // The header menu, managed from /admin/nav and committed to the site-config YAML.
    nav: { configPath: 'src/lib/site.config.yaml', menuName: 'primary', label: 'Navigation', maxDepth: 2 },
    // The preview knob: the (site) layout renders entries inside <main class="site-main">
    // (site.css), so the frame links the same theme/site sheets and reproduces that container.
    // Posts is the only concept, so no byConcept.
    preview: { stylesheets: [themeCss, siteCss], containerClass: 'site-main' },
  },
});
