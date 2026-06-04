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
| Markdown (posts) | cairn-cms engine render (`createRenderer`) | One shared remark/rehype pipeline: GFM, a sanitize floor, heading slugs, anchor hardening |
| Markdown (special pages) | mdsvex | Svelte components inside markdown for pages with interactive sections |
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
the Hugo trailing slash. A request to the old `/.../slug/` form 307-redirects to the
canonical no-slash URL, so no existing link breaks.

One catch-all route serves every post. `src/routes/[...path]/+page.server.ts` calls the
engine's `createPublicRoutes`: its `entries()` enumerates the post permalinks for prerender,
and its `entryLoad` returns the rendered HTML plus the SEO head.

Permalink shape lives in `src/lib/site.config.yaml` under `content.posts`
(`permalink: /:year/:month/:day/:slug`, `datePrefix: day`). Slug still derives from the
filename: `2026-03-06-early-march.md` → `/2026/03/06/early-march`.

---

## Content Pipeline

### Posts (cairn-cms delivery layer)

`src/content/posts/*.md` is bundled at build time via `import.meta.glob` with `?raw` +
`eager: true`, because Cloudflare Workers has no filesystem. One delivery layer,
`src/lib/content.ts`, sits in front of every public route. It hands the bundled corpus and
the adapter to the engine's `createSiteIndexes`, which returns a typed content index
(`all`, `byId`, `byTag`, `allTags`) and a site resolver for permalinks, adjacency, and the
content graph.

Frontmatter stays `title`, `date`, `draft`, `tags`, `description`. A single `defineFields`
declaration in `src/lib/cairn.config.ts` is the source of truth for the editor form, the
on-save validator, and the inferred frontmatter type.

**Committed manifest backstop.** `src/content/.cairn/index.json` records each post's
structural and graph fields: id, title, date, permalink, draft, and outbound `cairn:` links.
At module load `content.ts` rebuilds the manifest from the corpus and calls the engine's
`verifyManifest`. A drift throws and fails the build, so a stale manifest never ships.
Regenerate it with `npm run cairn:manifest` (the `scripts/build-manifest.mjs` script) and
commit the result. Note that the manifest tracks structure and graph edges, not prose, so a
body-only edit does not drift it.

**Content graph, fail-closed.** The render threads the engine's `buildLinkResolver`, so a
`cairn:` link resolves to a live permalink at build time. A dangling target throws out of the
render, and `svelte.config.js` rethrows any 5xx during prerender, so the first broken link
reddens the build instead of shipping.

**Tag routes:** `/tags/` and `/tags/[tag]/` prerender from the engine index. `entries()` in
`[tag]/+page.server.ts` drives static generation, `posts.byTag` filters, and a tag absent
from every post returns 404.

### Special Pages (mdsvex)

About and archives pages use mdsvex. A `.md` file holds editable prose; embedded Svelte
components handle dynamic behavior (archive listing, contact form). These mdsvex route
pages are edited in-repo. The cairn admin manages the `posts` collection only.

---

## About + Contact

No separate `/contact/` route. Contact form lives at the bottom of the about page,
accessible via `#contact` anchor. Nav "Contact" link → `/about/#contact`.

Form action: `src/routes/about/+page.server.ts`

Flow: validate Turnstile → send via Cloudflare Email Workers `send_email` binding.

Secrets: `TURNSTILE_SECRET_KEY`, `CONTACT_EMAIL`

---

## Search

`npx pagefind --site .svelte-kit/cloudflare` runs post-build. Generates static index in
`.svelte-kit/cloudflare/pagefind/`. Search UI is a Svelte component wrapping the Pagefind
JS API.

---

## CMS: cairn-cms (magic-link admin)

907.life is **consumer #2** of cairn-cms (see `../cairn-cms/docs/STATUS.md`), onboarded in
Pass F and migrated to the full `^0.24.0` public surface in Pass 16. It replaced the
never-wired Sveltia config (removed with `static/admin/`).

Mounted at `/admin`, in 907.life's own Worker. Editors sign in by email (magic link, no
GitHub account); a CodeMirror editor edits raw markdown; saving commits to `main` via the
shared GitHub App (committer `cairn-cms[bot]`, author = the editor), which auto-deploys.

- **Adapter** (`src/lib/cairn.config.ts`): `defineAdapter` with one **posts** concept at
  `src/content/posts/`, filename-based ids (`YYYY-MM-DD-slug`), a `defineFields` schema for
  title/date/description/draft and **free-form tags** (no controlled vocabulary). The editor
  preview calls the same engine `createRenderer` (`src/lib/render.ts`) that the published page
  and the feeds use, so the preview matches the live render. 907 ships no directive
  components, so its component registry is empty.
- **Backend reads.** `glw907/907-life` is public (like ecnordic), but the admin reads (list +
  edit) authenticate with the GitHub App installation token (5000/hr): anonymous reads share
  GitHub's 60/hr-per-IP limit across Cloudflare's shared egress IPs and 403 in prod (fixed in
  cairn-cms 0.3.1). The same token mints the commit path; reads fall back to anonymous if the App
  is unconfigured.
- **Bindings/secrets.** `AUTH_DB` (self-owned D1: editor allowlist, sessions, single-use magic
  tokens) and the `EMAIL` send binding in `wrangler.toml`; the `GITHUB_APP_*` creds via
  `wrangler secret put` / `.dev.vars`. The 0.6.0 cutover moved auth off the Pass-F `AUTH_KV` to D1.
  The self-owned auth uses opaque D1 session rows, so it needs no magic-link or session signing secret.
- **Guard.** `/admin/**` is gated in `hooks.server.ts` (session cookie → `locals.editor`);
  the admin layout sets `prerender = false` + `data-pagefind-ignore` so it's never indexed.

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

**Color tokens:** 17 semantic tokens defined in `@theme` (generates both CSS vars and
Tailwind utilities). Light (silk) values are defaults; `@plugin "daisyui/theme"` extends
the built-in dim theme with dark overrides. Tokens use `--color-*` namespace to avoid
collision with DaisyUI slots. Full token table in
`docs/superpowers/specs/2026-04-07-css-token-system-design.md`.

**Color:** `oklch()` throughout, no hex, no `rgb()`. Two hue anchors:
- Hue 230 (cool blue-grey): UI chrome (nav, borders, code blocks, date labels)
- Hue 61 (warm content): body text via DaisyUI theme (`--color-base-content`)

**Theme persistence:** Cookie-based (`theme` cookie) with `hooks.server.ts` SSR injection.
Inline `<script>` in app.html reads cookie → localStorage → prefers-color-scheme as
fallback chain. No flash on any path. Toggle in nav writes cookie + localStorage.

**DaisyUI theme config:** `@plugin "daisyui" { themes: silk --default, dim --prefersdark }`
enables both themes. Custom overrides use `@plugin "daisyui/theme"` (NOT raw
`[data-theme]` blocks) to inherit built-in theme variables like `base-100`.

**Typography hierarchy:**
- Body: Spectral 400/700. Warm serif, handles technical density without feeling clinical.
- Display: Karla 400–700. Used in nav logo only; provides sans contrast.
- Mono: Monaspace Neon. Tight line-height (1.35) for terminal character.

**Homepage layout:** Featured post shown in full (most recent), followed by summary list
("Earlier"). Rationale: the blog is read top-to-bottom. The newest thing is the point.

**Shared CSS in `app.css`:** `.post-body`, `.post-date`, `.post-tags`/`.post-tag`,
`.page-title`, and `.back-link` are global classes used across multiple routes.
Everything else is scoped per route.

**Site constants in `src/lib/config.ts`:** All site-specific values (`SITE_URL`,
`SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_AUTHOR`, `SITE_LOCALE`, `FEED_MAX_ITEMS`,
`HOMEPAGE_FEATURED_COUNT`) live here. A hookify rule (`site-constants`) catches
hardcoded drift in `.svelte` and `.ts` files. Adapting for a new site = update
`config.ts` + hookify pattern.

**URL helpers in `src/lib/utils.ts`:** posts now carry an engine `permalink`, so the old
`postUrl` helper is gone. `tagUrl(tag)` produces the tag URL. `formatDate` and
`formatShortDate` render display dates through a private `parseUtcDate(iso)` helper that
avoids timezone-shift on bare YYYY-MM-DD strings. Feed-date formatting moved into the engine,
so the `toRFC822` and `toISODateTime` helpers are gone too.

**Feeds, sitemap, robots:** RSS 2.0 at `/feed.xml`, JSON Feed 1.1 at `/feed.json`, plus
`/sitemap.xml` and `/robots.txt`. Both feeds render from one `feedItems()` list in
`src/lib/content.ts` through the engine's `rssResponse` and `jsonFeedResponse`, so the two
formats never drift. Sitemap and robots routes use the engine's `sitemapResponse` and
`robotsResponse`. Autodiscovery `<link rel="alternate">` tags in `+layout.svelte` cover both
feed formats.

**Hookify quality rules:** Ten rules in `.claude/hookify.*.local.md` enforce Svelte 5
runes, oklch colors, color token usage, DaisyUI v5 class names, Tailwind v4 APIs, and
SvelteKit patterns. Research-backed against official migration guides and community best
practices.

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
