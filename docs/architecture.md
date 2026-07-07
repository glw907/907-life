# 907.life Architecture

Design decisions for the SvelteKit rebuild.

> **Pattern intent:** This site is a testbed. Architecture is documented as a
> reusable pattern for future personal blog sites, not just "how this site works."

---

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | SvelteKit + TypeScript | Modern, first-class Cloudflare support, Svelte 5 runes |
| Styling | Tailwind CSS v4 + DaisyUI v5 | CSS-first config, no tailwind.config.js needed |
| Markdown (posts) | cairn-cms engine render (`createRenderer`) | One shared remark/rehype pipeline: GFM, a sanitize floor, heading slugs, anchor hardening, the default table-scroll wrap |
| Special pages | Plain Svelte components | About and Archives are hand-written `.svelte` routes, not markdown; `mdsvex` stays wired in `svelte.config.js` for a future markdown-authored page but has no consumer today |
| Search | Pagefind | Post-build static index, zero runtime JS cost |
| CMS | cairn-cms (magic-link admin) | Embedded, passwordless, GitHub-committing; per-site adapter (replaced Sveltia in Pass F) |
| Adapter | @sveltejs/adapter-cloudflare | First-class Workers support, form actions work natively |
| Contact form | Cloudflare Email Workers | Native Cloudflare, free tier, replaces Resend |
| Spam protection | Cloudflare Turnstile | Carried over from Hugo site |
| Fonts | Spectral + Karla + Monaspace Neon (woff2, self-hosted) | Scholar's study aesthetic: Spectral for prose warmth, Monaspace Neon for terminal-precise code |

**Reusable core (the pattern):**
SvelteKit + TS + adapter-cloudflare · Tailwind v4 + DaisyUI v5 · cairn-cms engine render / mdsvex pipeline
· Pagefind · cairn-cms magic-link admin (per-site adapter) · Cloudflare Email Workers contact form
· GitHub Actions → Cloudflare Workers deployment

**Site-specific:** domain, content, fonts, Cloudflare secrets

---

## Routing

URL structure carried over from Hugo: `/:year/:month/:day/:slug`. An engine permalink drops
the Hugo trailing slash, and the rebuilt site reproduces every one of the pre-rebuild
sitemap's 23 permalinks at its exact canonical path (verified in Pass 18's crawl diff).

One catch-all route serves every post, inside the `(site)` chrome group:
`src/routes/(site)/[...path]/+page.server.ts` calls the engine's `createPublicRoutes`
(`@glw907/cairn-cms/delivery`): its `entries()` enumerates the post permalinks for
prerender, and its `entryLoad` returns the rendered HTML plus the SEO head. `/archives`,
`/tags`, and `/tags/[tag]` are site-owned siblings in the same group, not concept entries;
`src/theme/site-routes.ts`'s `EXTRA_ROUTES` lists every site-owned route so the sitemap can
fold them in (see the CMS section below).

Permalink shape lives in `src/theme/cairn.config.ts`'s `posts` concept
(`permalink: '/:year/:month/:day/:slug'`, `datePrefix: 'day'`). Slug still derives from the
filename: `2026-03-06-early-march.md` → `/2026/03/06/early-march`.

---

## Content Pipeline

The site's own code splits into `src/chassis/` (genre-free plumbing, copied from cairn-cms's
showcase where a file is genuinely site-agnostic) and `src/theme/` (907's own adapter config,
chrome, and token values), aliased as `$chassis`/`$theme` in `svelte.config.js`. Read
`src/chassis/README.md` for the full boundary rule and the seam list; this section covers
only what each side does for content delivery.

### Posts (cairn-cms delivery layer)

`src/content/posts/*.md` is bundled at build time via `import.meta.glob` with `?raw` +
`eager: true`, because Cloudflare Workers has no filesystem. One delivery layer,
`src/chassis/content.ts`, sits in front of every public route. It hands the bundled corpus
and the adapter (`$theme/cairn.config.ts`) to the engine's `createSiteIndexes`, which returns
a typed content index (`all`, `byId`, `byTag`, `allTags`) and a site resolver for permalinks,
adjacency, and the content graph.

Frontmatter stays `title`, `date`, `draft`, `tags`, `description`. A single `posts` concept
in `src/theme/cairn.config.ts`, declared with the v2 `defineConcept`/`fieldset` idiom, is the
source of truth for the editor form, the on-save validator, and the inferred frontmatter
type.

**Committed manifest backstop.** `src/content/.cairn/index.json` records each post's
structural and graph fields: id, title, date, permalink, draft, and outbound `cairn:` links.
The `cairnManifest()` Vite plugin (`vite.config.ts`) verifies the committed manifest against
the corpus on every build, outside the prerender lifecycle, so a drift fails the build
regardless of `svelte.config.js`'s prerender error policy. Regenerate it with
`npm run cairn:manifest` and commit the result. The manifest tracks structure and graph
edges, not prose, so a body-only edit does not drift it.

**Content graph, fail-closed.** The render threads the engine's `buildLinkResolver`, so a
`cairn:` link resolves to a live permalink at build time. A dangling target throws out of the
render, and `svelte.config.js` rethrows any 5xx during prerender, so the first broken link
reddens the build instead of shipping.

**Tag routes:** `/tags` and `/tags/[tag]/` are site-owned routes (not concept entries) that
prerender from the engine index. `entries()` in `[tag]/+page.server.ts` drives static
generation from `posts.allTags()`, `posts.byTag` filters, and a tag absent from every post
returns 404. Tag labels come from the curated `{value, label}` vocabulary in
`src/theme/site.config.yaml`, read through `extractVocabulary(siteConfig)`.

**Media.** The adapter's `media: { bucketBinding: 'MEDIA_BUCKET' }` block turns on the media
library: `src/routes/media/[...path]/+server.ts` streams content-addressed image bytes from
the `MEDIA_BUCKET` R2 binding via the engine's `createMediaRoute`, and
`src/theme/cairn.config.ts`'s `publicMediaResolver` rewrites a frontmatter `image` or a
`media:` reference to that URL for the public build (the admin preview injects its own
resolver instead). A post with no media reference is unaffected.

### Special pages

About and Archives are plain `.svelte` routes under `src/routes/(site)/`, not markdown: the
bio and the contact form are hand-written in `about/+page.svelte`, and the archive listing
reads the engine's post index through `archives/+page.server.ts`. `mdsvex` stays wired in
`svelte.config.js` for a future markdown-authored page, but nothing under `src/routes/`
currently is one. The cairn admin manages the `posts` collection only; About and Archives
are edited in-repo.

---

## About + Contact

No separate `/contact/` route. Contact form lives at the bottom of the about page,
accessible via `#contact` anchor. Nav "Contact" link → `/about/#contact`.

Form action: `src/routes/(site)/about/+page.server.ts`

Flow: validate Turnstile → send via Cloudflare Email Workers `send_email` binding.

Secrets: `TURNSTILE_SECRET_KEY`, `CONTACT_EMAIL`

---

## Search

`npm run build:search` (`vite build && npx pagefind --site .svelte-kit/cloudflare`) runs the normal
build, then crawls the prerendered output and writes a static index plus a runtime module to
`.svelte-kit/cloudflare/pagefind/`, so it deploys as ordinary static assets alongside everything
else `[assets]` in `wrangler.toml` already serves. `src/theme/components/SearchModal.svelte` is the
UI: a header-triggered DaisyUI modal (also opens on Cmd/Ctrl+K) calling Pagefind's low-level JS API
directly, not its bundled default UI, so results render on the same token layer as the rest of the
chrome. The full pattern write-up (the runtime-only-import mechanics, the dev-vs-built-index
fallback) is [`docs/pagefind-search-pattern.md`](pagefind-search-pattern.md).

---

## CMS: cairn-cms (magic-link admin)

907.life is **consumer #2** of cairn-cms (see `../cairn-cms/docs/STATUS.md`), onboarded in
Pass F and carried through the `^0.24.0`–`^0.68.0` window described below. Pass 18 (2026-07-05)
retired that whole app for a fresh scaffold on the Waymark starter template and cairn-cms
`^0.80.0`, on the current v2 adapter idiom (`defineAdapter`/`defineConcept`/`fieldset`, not the
`defineFields` shape the earlier passes used). Pass 20 then split `src/lib` into `src/chassis/`
and `src/theme/` (see the Content Pipeline section above) and repointed to the published
`^0.81.0`. The pre-Pass-18 history below (the `0.24.0` → `0.68.0` window) is kept for its
still-true mechanism notes (CSRF ownership, observability, the single-mount admin shape); its
file paths predate the chassis split and its adapter idiom predates `defineConcept`/`fieldset`.

**cairn-0.36.0 retrofit (the `0.24.0` → `0.36.0` window).** Four required consumer actions, plus
the additive logging:
- **Runtime composition** (`src/lib/cairn.server.ts`): `composeRuntime` takes the object form
  `composeRuntime({ adapter: cairn, siteConfig })` from `0.25.0`. The runtime derives the per-concept
  URL policy from the site config, so the old positional `urlPolicy` argument is gone.
- **Chrome isolation** (`0.33.0`): the admin must render with no host chrome around it. The root
  `+layout.svelte` is bare, and 907's public chrome (`Nav`, `SearchModal`, the `max-w-3xl` main, the
  footer, `app.css`, and the feed-autodiscovery head links) lives in a `src/routes/(site)/` route
  group. Group folders are URL-transparent, so every public path is unchanged. `/admin` and the
  endpoints (`feed.xml`, `feed.json`, `sitemap.xml`, `robots.txt`, `healthz`) sit at the route root
  outside the group and inherit only the bare layout. The `prerender = true` default moved into
  `(site)/+layout.server.ts`; every endpoint and the admin already set `prerender` explicitly, so the
  root no longer needs a default.
- **CSRF ownership** (`0.35.0`): `svelte.config.js` sets `csrf: { checkOrigin: false }`, handing
  cairn's auth guard sole CSRF authority for `/admin`. The guard validates a `__Host-cairn_csrf`
  double-submit token on every admin form POST and keeps a strict `Origin` check for this site's own
  non-admin forms (the contact form), so disabling the framework's global check is not a net loss. The
  zone already forces HTTPS (Always Use HTTPS + HSTS), which the magic-link sign-in needs.
- **Observability** (`0.36.0`): `wrangler.toml` enables `[observability]`, so Workers Logs ingests
  cairn's structured diagnostic events (auth, commit, guard) for this site. Query them by `event` or
  `editor` in the dashboard Logs tab.

**cairn-0.51.0 crossing (the `0.36.0` → `0.51.0` window, Pass 16.2, 2026-06-12).** The admin seam
became the single mount: the old per-route shim tree under `src/routes/admin/` is gone, replaced
by one catch-all pair (`src/routes/admin/[...path]/`) re-exporting `admin.load`/`admin.actions`
from the composer, which now builds `createCairnAdmin(runtime)` instead of the four 0.36-era route
factories. Action-adding engine releases are additive for this site from here on. `app.d.ts`
imports `@glw907/cairn-cms/ambient` for `App.Locals` (and `AuthEnv` from the package root; the
`/sveltekit` subpath does not export it). Floors rose to svelte `^5.56.3` and kit `^2.12`. The
editor preview renders in the engine's sandboxed iframe wired to this site's real styling through
the adapter's `preview` knob: `app.css` is referenced only through `?url` imports (the `(site)`
layout links it in `svelte:head`; a static import would fold the sheet into a CSS chunk and the
preview's server-resolved URL would 404), `bodyClass` carries the `(site)` main's classes, and the
rendered markdown sits in one `post-body` container, which every content rule in `app.css` targets
as a flat descendant. Both build pipelines emit their own hashed copy of the sheet (the page links
the client copy, the frame the server copy); ecxc ships the same shape. The review fold-in also
allowlisted the `theme` cookie before it reaches the `data-theme` attribute (an injection sink the
admin shared), scoped `prerender = false` over the `/admin` subtree by layout, and made `/healthz`
log its error detail instead of echoing it to anonymous callers.

Mounted at `/admin`, in 907.life's own Worker. Editors sign in by email (magic link, no
GitHub account); a CodeMirror editor edits raw markdown; saving commits to `main` via the
shared GitHub App (committer `cairn-cms[bot]`, author = the editor), which auto-deploys.

**Current shape (Pass 18–20, `^0.81.0`).**

- **Adapter** (`src/theme/cairn.config.ts`): `defineAdapter` with one **posts** concept
  declared via `defineConcept`/`fieldset` at `src/content/posts/`, filename-based ids
  (`YYYY-MM-DD-slug`), fields for title/date/description/draft and a **curated tag
  vocabulary** (`fields.multiselect({ taxonomy: true })`, sourced from
  `src/theme/site.config.yaml`'s `vocabulary` list, not free-form). The editor preview calls
  the same entry-aware `cairn.rendering.render` (`src/theme/render.ts`, wrapping the engine's
  `createRenderer`) that the published page and the feeds use, so the preview matches the
  live render. 907 ships no directive components, so its component registry is empty.
- **Media.** The adapter's `media: { bucketBinding: 'MEDIA_BUCKET' }` block turns on the
  admin's media library (upload, browse, alt text, replace, safe-delete) over the
  `MEDIA_BUCKET` R2 binding; see the Media paragraph under Content Pipeline for the public
  read side.
- **Nav.** The header menu is editor-managed at `/admin/nav`, committed to
  `src/theme/site.config.yaml`'s `menus.primary` list (`editor.nav` in the adapter config).
- **Backend reads.** `glw907/907-life` is public, but the admin reads (list + edit)
  authenticate with the GitHub App installation token (5000/hr): anonymous reads share
  GitHub's 60/hr-per-IP limit across Cloudflare's shared egress IPs and 403 in prod. The same
  token mints the commit path; reads fall back to anonymous if the App is unconfigured.
- **Bindings/secrets.** `AUTH_DB` (self-owned D1: editor allowlist, sessions, single-use magic
  tokens), the `EMAIL` send binding, and `MEDIA_BUCKET` (R2) in `wrangler.toml`; the
  `GITHUB_APP_*` creds via `wrangler secret put` / `.dev.vars`. The self-owned auth uses
  opaque D1 session rows, so it needs no magic-link or session-signing secret.
- **Guard.** `src/hooks.server.ts` delegates the whole `/admin` gate (session cookie, CSRF,
  route dispatch) to the engine's `createAuthGuard()`, no hand-rolled `locals.editor` mapping.
  `src/routes/admin/+layout.server.ts` sets `prerender = false` over the subtree, so no admin
  path is ever baked or reachable by Pagefind's post-build index.

Local editing + git push still works for any content; the admin is the no-git path for posts.

---

## Deployment

Push to `main` → GitHub Actions → `npm run build` + `npx pagefind --site
.svelte-kit/cloudflare` + `npx wrangler deploy` → live in ~2 min.

**Build output path:** adapter-cloudflare v5 outputs to `.svelte-kit/cloudflare/`, not
`build/`. `wrangler.toml` `main` and `[assets] directory` both point there. Pagefind
indexes prerendered HTML from the same directory. GitHub Actions secrets:
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

---

## Design System

Since Pass 18, the design system is the Waymark starter template's chassis/theme token
layering, not a site-authored `@theme` block. `src/chassis/tokens.css` declares every
design-scale key (`--font-*`, `--text-step-*`, `--spacing-*`, `--color-muted`,
`--color-card-border`, and the DaisyUI plugin activation) with a generic default;
`src/theme/theme.css` `@import`s it and redeclares the same keys with Waymark's concrete
numbers and the two named DaisyUI themes (`cairn` light, `cairn-dark`); `src/theme/907-theme.css`
layers 907's own identity on top as a third, unlayered override. Cascade order does the
override at every layer, so a re-skin never needs `!important` except where 907's own layer
overrides DaisyUI's own compiled (non-`@layer`) base-ladder rule; see `907-theme.css`'s header
comment for exactly where and why. The full boundary rule and every override seam are in
`src/chassis/README.md`.

**Color:** `oklch()` throughout, no hex, no `rgb()`, `--color-*` tokens only (never a raw
`oklch()` in component styles). 907's identity layer sets a warm cream paper and near-black
ink (in place of Waymark's neutral, hue-free default ladder) and an aurora-green accent, an
Alaska area-code reference, in place of Waymark's default ink-blue; only the hue rotates from
the neutral theme's own accent, so the AA contrast pairs the neutral theme already cleared
stay cleared.

**Theme persistence:** Cookie-based, through the shared `$chassis/theme-toggle` mechanism
(`resolveTheme`/`applyTheme`/`toggleTheme`), which knows only a light/dark DaisyUI theme-name
pair and a cookie name; `SiteHeader.svelte` supplies 907's own (`cairn`/`cairn-dark`,
`cairn-site-theme`). A no-flash inline `<script>` in `app.html` reads the cookie and sets
`data-theme` before first paint; no cookie leaves the attribute unset, so `theme.css`'s
`prefers-color-scheme` block picks the system scheme with no JS involved at all. Nothing runs
server-side in `hooks.server.ts` for theming; that file's whole job is the cairn-cms auth
guard (see the CMS section).

**Typography hierarchy:**
- Body: Spectral 400/700 (`--font-body`). Warm serif, handles technical density without
  feeling clinical.
- Display: Karla 400–700 (`--font-display`). Wordmark and headings.
- Mono: Monaspace Neon (`--font-mono`). Code blocks.

All three are self-hosted `@font-face` declarations in `907-theme.css` from `static/fonts/`,
the pairing the site ran before the Waymark rebuild (`theme.css` also imports the Waymark
default Fontsource faces first; 907's layer overrides every `--font-*` token, so those faces
never render, only load).

**Homepage layout:** The newest post gets a "Latest" lead treatment in full, followed by an
"Archive" list of the rest, with an optional tag filter once the archive passes twelve
entries (`src/routes/(site)/+page.svelte`). Rationale: the blog is read top-to-bottom. The
newest thing is the point.

**Shared components in `src/theme/components/`:** `PostRow.svelte` (one dated post row with
its tags, shared by `/archives` and a tag detail page through `PostList.svelte`),
`SiteHeader.svelte`/`SiteFooter.svelte`/`Wordmark.svelte` (the chrome), `SearchModal.svelte`,
`ContactForm.svelte`. Everything else is scoped per route.

**Tag vocabulary in `src/theme/site.config.yaml`:** the curated `{value, label}` list is the
source of truth for tag display labels and the admin's taxonomy picker; a post's frontmatter
still carries the raw `value` token. Site identity (`siteName`, `description`, `author`,
`locale`) and the header nav (`menus.primary`) live in the same file, editor-managed for the
nav through `/admin/nav`.

**Date formatting in `src/theme/format-date.ts`:** `formatDate(iso)` renders the long-format,
uppercase display date through a private `parseUtcDate` helper that avoids timezone-shift on
bare `YYYY-MM-DD` strings. Posts carry an engine `permalink` directly, so there is no
`postUrl` helper; a tag URL is the literal `/tags/<tag>/` string (`PostRow.svelte`), since the
old `tagUrl` helper had only the one call site.

**Feeds, sitemap, robots:** RSS 2.0 at `/feed.xml`, JSON Feed 1.1 at `/feed.json`, plus
`/sitemap.xml` and `/robots.txt`. Both feeds render from one `buildFeedItems()` list in
`src/chassis/feed.ts` through the engine's `rssResponse` and `jsonFeedResponse`, so the two
formats never drift. `sitemap.xml` folds `sitemapView` (the concept-derived URLs) together
with `src/theme/site-routes.ts`'s `EXTRA_ROUTES` (the site-owned routes) and a per-tag entry;
`robots.txt` uses the engine's `robotsResponse`. Autodiscovery `<link rel="alternate">` tags
in the `(site)` layout and the root error page cover both feed formats.

**Hookify quality rules:** rules in `.claude/hookify.*.local.md` enforce Svelte 5 runes,
oklch colors, DaisyUI v5 class names, Tailwind v4 APIs, and SvelteKit patterns.
`.claude/rules/design-system.md` auto-loads on `.svelte`/`.css` edits with the same binding
facts as this section, kept in sync with it.

**Turnstile in dev:** Skipped gracefully. `verifyTurnstile` only runs when
`platform.env.TURNSTILE_SECRET_KEY` is present. Always-pass test key
(`1x00000000000000000000AA`) used for the widget in dev.

---

## What Replaced What

| Hugo | SvelteKit |
|---|---|
| `themes/PaperMod` + layout overrides | Own components, no theme |
| `build.sh` to pin Hugo version | `package.json` lockfile |
| `src/worker.js` separate Worker | SvelteKit form action in `+page.server.ts` |
| Resend + `RESEND_API_KEY` | Cloudflare Email Workers (native) |
| Page bundles (`posts/slug/index.md`) | Flat files (`src/content/posts/slug.md`) |
| lunr.js search | Pagefind |
