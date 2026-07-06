// 907.life's renderer, composed once from the engine. 907 has no directive components, so the
// registry is empty. The engine still supplies remark-gfm, the sanitize floor, heading slugs,
// anchor hardening, cairn: link resolution through opts.resolve, and the default table-scroll
// wrap. The public catch-all page, the feeds, and the admin preview all call this one renderer,
// so the editor preview matches the published page.
import { createRenderer, defineRegistry } from '@glw907/cairn-cms';

const renderer = createRenderer(defineRegistry({ components: [] }));

/** Render a post body to sanitized HTML. Pass opts.resolve to rewrite cairn: links. */
export const renderMarkdown = renderer.renderMarkdown;
