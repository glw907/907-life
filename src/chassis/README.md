# The chassis

The boundary rule, per cairn-cms's canonical statement
(`examples/showcase/src/chassis/README.md` in the `cairn-cms` repo): **a theme is everything that
isn't chassis.** `src/chassis/` holds the genre-free layer 907's theme (living in `src/theme/`,
plus the route files under `src/routes/` that SvelteKit's filesystem routing pins in place) mounts
onto: the plumbing every site needs regardless of what it looks like. Everything outside
`src/chassis/` (the concrete adapter config, the chrome components, the home and article
composition, the theme's color and type values) is the theme's own content. A theme file reaches
chassis only through its exported seams: the `$chassis` alias in `.ts`/`.svelte` files, or a
relative `@import` in a `.css` file (aliases do not resolve in CSS), always naming one of the files
below.

The chassis files here came from `cairn-cms`'s own showcase, the reference site the chassis
boundary was first cut against (verbatim where a file is genuinely site-agnostic; `content.ts`,
`feed.ts`, and `cairn.server.ts` carry the same shape but wire 907's own single `posts` concept,
since the showcase's canonical copies of those three assume `posts` and `pages` both exist).

## What lives here

| File | What it is |
| --- | --- |
| `content.ts` | The delivery content layer: globs the markdown, builds the site/posts indexes through `createSiteIndexes`. |
| `feed.ts` | Maps the posts index into `cairn-cms/delivery`'s `FeedItem` shape, shared by the RSS and JSON Feed routes. |
| `cairn.server.ts` | The one server-side runtime composition point (`composeRuntime`, `createCairnAdmin`); every server route that needs the runtime imports it from here. |
| `theme-toggle.ts` | The light/dark toggle mechanism: resolve the active theme, apply a choice, persist it to a cookie. |
| `tokens.css` | The token SYSTEM: Tailwind and the DaisyUI plugin activation, the design-scale keys with generic defaults, and the semantic (code-highlight, ink, elevation, CTA) bindings. |
| `prose.css` | The reading-surface foundation: every prose element bound to tokens, with the signature flourish gestures behind `[data-flourish]`. |
| `composition.css` | The composition primitives: card, band, section, hero, sidebar-layout. Unused in 907's current markup, same as in the showcase; a theme reaches for one instead of hand-rolling its own. |

Omitted from this copy, deliberately: `dev-gate.ts` (the showcase's dev-backend feature flag; 907
has no dev backend) and `render.ts` (the showcase's icon-rendering wiring for `defineComponent()`
build functions; 907 registers no directive components, so there is no icon set to wire). Neither
file has a consumer here. Per the chassis's own subtractability rule (a developer may drop an
unused chassis element with no other seam depending on it), adding either back is a matter of
copying the file from `cairn-cms`'s showcase and wiring its one consumer; nothing else references
them.

The SvelteKit route files that touch delivery plumbing (`feed.xml`, `feed.json`, `sitemap.xml`,
`robots.txt`, `media/[...path]`, `healthz`, the `/admin` mount) stay in `src/routes/`, since
SvelteKit's routing is filesystem-based; they import chassis logic through the `$chassis` alias
(`svelte.config.js`) instead of duplicating it. The same route files reach the theme's own content
(the adapter config, the site-owned route list) through a second alias, `$theme` (`src/theme/`),
the mirror image of `$chassis` for everything that is not genre-free.

## Every override seam

**Adapter and delivery wiring.** `content.ts`, `feed.ts`, and `cairn.server.ts` take the theme's own
`cairn.config.ts` adapter (concepts, fields, backend) as input; none of them declares any content
model of its own. `feed.ts`'s `FEED_MAX_ITEMS` cap is 907's own content policy, not a chassis
default; a theme that wants every post in its feed removes the `.slice()` call.

**The token system (`tokens.css`).** Every design-scale key (`--font-*`, `--text-step-*`,
`--spacing-*`, `--leading-*`, `--tracking-*`, `--container-measure*`, `--color-muted`,
`--color-card-border`) is declared inside `@theme` with a generic default. `theme.css` `@import`s
`tokens.css` first, then redeclares the same keys with its real numbers; cascade order does the
override. `907-theme.css` layers a second override on top of that (see its own header comment).

**The prose foundation (`prose.css`).** Every element reads a token, so a re-skin carries the
reading surface forward with no edit here. `907-theme.css` overrides three of prose.css's rules
(the body-link underline, the blockquote rule, the inline-code chip) with 907's own pre-rebuild
look, in plain unlayered CSS that beats prose.css's `@layer components` rules unconditionally; see
that file's own comment for why no `!important` is needed there.

**The theme-toggle mechanism (`theme-toggle.ts`).** `resolveTheme`/`applyTheme`/`toggleTheme` know
nothing about which two DaisyUI theme names or which cookie name a theme uses; `SiteHeader.svelte`
passes its own `ThemeToggleConfig`.

**Composition primitives (`composition.css`).** `.cairn-card`, `.cairn-band`, `.cairn-section`,
`.cairn-hero`, `.cairn-sidebar-layout`, each exposing its own `--cairn-<primitive>-*` custom
properties for a per-instance override. Adopting one is a theme choice, never a requirement.

## Adding a new primitive or seam

Read this file's boundary rule first: genre-free plumbing and configurable structure belong here; a
specific look, a specific chrome, or a specific content model belongs to the theme.
