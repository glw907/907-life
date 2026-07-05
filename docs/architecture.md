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

`npm run build:search` (`vite build && npx pagefind --site .svelte-kit/cloudflare`) runs the normal
build, then crawls the prerendered output and writes a static index plus a runtime module to
`.svelte-kit/cloudflare/pagefind/`, so it deploys as ordinary static assets alongside everything
else `[assets]` in `wrangler.toml` already serves. `src/lib/components/SearchModal.svelte` is the
UI: a header-triggered DaisyUI modal (also opens on Cmd/Ctrl+K) calling Pagefind's low-level JS API
directly, not its bundled default UI, so results render on the same token layer as the rest of the
chrome. The full pattern write-up (the runtime-only-import mechanics, the dev-vs-built-index
fallback) is [`docs/pagefind-search-pattern.md`](pagefind-search-pattern.md).

---

## CMS: cairn-cms (magic-link admin)

907.life is **consumer #2** of cairn-cms (see `../cairn-cms/docs/STATUS.md`), onboarded in
Pass F, migrated to the full `^0.24.0` public surface in Pass 16, and retrofitted to `^0.36.0`
in the cairn-0.36.0 upgrade (2026-06-09). It replaced the never-wired Sveltia config (removed
with `static/admin/`).

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
