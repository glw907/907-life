// 907.life's renderer, composed once from the engine. 907 has no directive components, so the
// registry is empty. The engine still supplies remark-gfm, the sanitize floor, heading slugs,
// anchor hardening, and cairn: link resolution through opts.resolve. The public catch-all page,
// the feeds, and the admin preview all call this one renderer, so the editor preview matches the
// published page. `rehypeTableScroll` composes onto the engine's own `rehypePlugins` seam, so the
// table wrapping runs on the hast tree cairn already built instead of a second parse of the
// rendered HTML string.
import { createRenderer, defineRegistry } from '@glw907/cairn-cms';
import { rehypeTableScroll } from './render/table-scroll.js';

const renderer = createRenderer(defineRegistry({ components: [] }), {
  rehypePlugins: [rehypeTableScroll],
});

/** Render a post body to sanitized HTML. Pass opts.resolve to rewrite cairn: links. */
export const renderMarkdown = renderer.renderMarkdown;
