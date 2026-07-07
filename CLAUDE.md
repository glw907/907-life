# 907.life

Personal blog. SvelteKit + TypeScript, deployed to Cloudflare Workers.

@docs/STATUS.md
@docs/architecture.md

## Stack

SvelteKit · TypeScript · Tailwind CSS v4 · DaisyUI v5 · Pagefind · cairn-cms (magic-link admin) · @sveltejs/adapter-cloudflare

## Project structure

Built from cairn-cms's Waymark starter template (Pass 18) and split onto its chassis/theme
boundary (Pass 20): `src/chassis/` is the genre-free plumbing copied from cairn-cms's own
showcase (delivery, feeds, the runtime composition point, the token system, the prose
foundation), and `src/theme/` is 907's own adapter config, chrome components, and identity
values (`theme.css`, `907-theme.css`, `site.config.yaml`). Aliased `$chassis`/`$theme` in
`svelte.config.js`; `$lib` is unused, this site keeps no `src/lib`. Read
`src/chassis/README.md` before touching either side; it is the canonical statement of the
boundary rule and every override seam. `docs/architecture.md` documents the current shape in
full.

## Development Workflow

Pass-driven. Each pass has a starter prompt in `docs/STATUS.md`, a
plan under `docs/superpowers/plans/`, and usually a spec under
`docs/superpowers/specs/`.

The phrases "continue development," "next pass," "finish pass," and "ship
pass" invoke the `site-pass` skill (this repo's own roadmap), which covers
both starting a pass (read STATUS, read plan, execute) and ending one (the
consolidation ritual). cairn-cms is a separate standalone repo; this site
consumes `@glw907/cairn-cms` from the npm registry by version range.

**On-demand reading:**
- `docs/STATUS.md`: current pass, pass table, next starter prompt. Open at the start of every pass.
- `docs/architecture.md`: design decisions and system overview. Consult when planning structural changes.
- `docs/superpowers/specs/`: feature specs. Pull the relevant spec before starting implementation.
- `BACKLOG.md`: known issues and future work. Check before starting a pass; it may contain relevant known limitations.
- `.claude/rules/design-system.md`: auto-loads when editing `.svelte`/`.css`. Contains color token, typography, and shared class binding facts.

## Build & Dev

```bash
npm install
npm run dev                                    # dev server at http://localhost:5173
npm run build                                  # build to .svelte-kit/cloudflare/
npm run build && npx pagefind --site .svelte-kit/cloudflare     # build + search index
npx wrangler dev                               # test contact form at http://localhost:8787
```

## New Post

Create `src/content/posts/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Post Title"
date: YYYY-MM-DD
draft: false
description: "One sentence description."
tags: ["tag1", "tag2"]
---
```

`tags` values should come from the curated vocabulary in `src/theme/site.config.yaml`; a
value outside it has no display label.

## Content Pipeline

- **Posts** (`src/content/posts/*.md`): rendered through the cairn-cms engine (`createRenderer`) via the `src/chassis/content.ts` delivery layer. Straight prose, no directive components.
- **Special pages** (`src/routes/(site)/about/`, `src/routes/(site)/archives/`): plain `.svelte` routes, not markdown. `mdsvex` stays wired in `svelte.config.js` for a future markdown-authored page but has no consumer today; edit About's bio and the Archives listing in-repo.

## cairn-cms admin

907.life is **consumer #2** of cairn-cms (the embedded magic-link, GitHub-committing CMS,
a separate standalone repo). Editors sign in by email at `/admin` (no GitHub account)
and edit raw markdown in a CodeMirror editor; saving commits to `main` via the shared GitHub App
(`cairn-cms[bot]`), which auto-deploys. (907 runs cairn-cms `^0.81.0` since Pass 20's chassis
restructure; the editor preview calls the same engine render as the published page.)

- **Adapter:** `src/theme/cairn.config.ts` uses `defineAdapter`/`defineConcept`/`fieldset` (the
  v2 idiom) for the posts concept (filename-based ids, a **curated tag vocabulary** sourced from
  `site.config.yaml`, engine `createRenderer` preview via `src/theme/render.ts`), backend
  `glw907/907-life`, media on (`MEDIA_BUCKET`).
- **Validator:** the adapter's `fieldset` schema in `src/theme/cairn.config.ts`. Reads use the
  GitHub App installation token (5000/hr) when configured. Without it, anonymous reads 403 from
  Cloudflare's shared egress IPs hitting GitHub's 60/hr limit; the same token also commits.
- **Routes:** `src/routes/admin/**` (single-mount catch-all). **Guard:** `src/hooks.server.ts`
  delegates the whole gate to the engine's `createAuthGuard()`.
- **Bindings:** `AUTH_DB` (self-owned D1: editor allowlist, sessions, single-use magic tokens),
  `EMAIL`, and `MEDIA_BUCKET` (R2) in `wrangler.toml`. Opaque D1 session rows, so no signing
  secret is needed for auth.
- **Replaces Sveltia** (removed in Pass F; the dead `static/admin/` is gone).

## Worker & Secrets

Secrets the current code actually reads: `TURNSTILE_SECRET_KEY`, `CONTACT_EMAIL` (the contact
form), and `GITHUB_APP_ID` / `GITHUB_APP_INSTALLATION_ID` / `GITHUB_APP_PRIVATE_KEY_B64` (the
GitHub App commit path). `npx wrangler secret list` also currently shows four unused
leftovers from retired auth systems (`AUTH_SECRET`, `MAGIC_LINK_SECRET`, `SESSION_SECRET` from
the pre-cairn hand-rolled/better-auth eras, `RESEND_API_KEY` from the pre-Cloudflare-Email
contact form): zero references in `src/`, safe to delete, not yet done as of this sweep.

Set with: `npx wrangler secret put SECRET_NAME`

## Deploy

Push to `main` → GitHub Actions runs build + pagefind + wrangler deploy → live in ~2 min.

Manual: `npm run build && npx pagefind --site .svelte-kit/cloudflare && npx wrangler deploy`

## Design work

907.life is a cairn-family **site rebuild**, one of the two fidelity tiers the family's
polish standard defines (quite-close-and-improved, not glance-indistinguishable, which is the
bar for a theme port). Any future rebuild, re-skin, or layout change on this site follows
`../cairn-cms/CLAUDE.md`'s **polish and fidelity standards** and **the one-check rule**: no
design plan from a verbal inventory alone, a side-by-side crop against the live site before
calling a change done, and at least one full-page render read by the agent's own eyes before
anything deploys (this site is not member-facing, so it does not additionally need Geoff's
before/after approval, but the read-a-screenshot step still applies). The family also holds
this site to **the responsive standard**: 320/390/768/1440/2560, composed at the extremes, not
merely unbroken.

## Code Quality Rules

Hookify guards enforce these conventions automatically. Rules live in `.claude/hookify.*.local.md`.

| Rule | Trigger | What it catches |
|---|---|---|
| `svelte5-runes` | Edit `.svelte` | `$:`, `export let`, `on:` directives, `createEventDispatcher`, `$derived(() => ...)` |
| `oklch-colors` | Edit `.svelte`/`.css` | Hex or `rgb()` colors (use `oklch()` throughout) |
| `no-arbitrary-tailwind` | Edit `.svelte`/`.html`/`.ts` | Tailwind arbitrary values and dynamic class strings |
| `daisyui-v5-classes` | Edit `.svelte`/`.html` | Removed DaisyUI v4 class names (e.g. `input-bordered`, `card-compact`) |
| `daisyui-v5-vars` | Edit `.svelte`/`.css` | Old DaisyUI CSS vars (`--bc`, `--p`, `--b1`, etc.) |
| `tailwind-v3-compat` | Edit `.svelte`/`.html` | Removed/renamed Tailwind v3 utilities (`shadow-sm`, `bg-opacity-*`, etc.) |
| `sveltekit-patterns` | Edit `.svelte`/`.ts` | `$app/stores` (deprecated), `goto()` external URLs, `fs` imports |
| `html-injection` | Edit `.svelte` | `{@html}` usage (prompts XSS checklist) |
| `hardcoded-oklch` | Edit `.svelte`/`.css` | Raw `oklch()` values (use `var(--color-*)` tokens) |
| `svelte-check-reminder` | Session stop | Reminds to run `/svelte-check` before declaring done |

**Design system anchors:**
- Colors: `--color-*` tokens layered across `src/chassis/tokens.css` (generic defaults) →
  `src/theme/theme.css` (Waymark's numbers, the two `cairn`/`cairn-dark` DaisyUI themes) →
  `src/theme/907-theme.css` (907's own identity, unlayered overrides)
- Typography: Spectral (body), Karla (display), Monaspace Neon (mono)
- Tokens: `var(--color-*)` for all colors, DaisyUI v5 semantic classes for layout, scoped `<style>` for design-specific rules
- Never use DaisyUI v4 short CSS vars (`--bc`, `--p`, etc.); they were renamed in v5 and silently resolve to nothing.
- Never hardcode `oklch()` in component styles; add or override a token in `src/theme/theme.css` or `907-theme.css` instead.

## Cross-Site Admin

For DNS, domain verification, or Cloudflare service config: `cd ~/Projects/cloudflare-sites && claude`
