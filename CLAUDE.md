# 907.life

Personal blog — SvelteKit + TypeScript, deployed to Cloudflare Workers.

@docs/STATUS.md
@docs/architecture.md

## Stack

SvelteKit · TypeScript · Tailwind CSS v4 · DaisyUI v5 · mdsvex · remark + remark-gfm · Pagefind · cairn-cms (magic-link admin) · @sveltejs/adapter-cloudflare

## Development Workflow

Pass-driven. Each pass has a starter prompt in `docs/STATUS.md`, a
plan under `docs/superpowers/plans/`, and usually a spec under
`docs/superpowers/specs/`.

Trigger phrases — "continue development," "next pass," "finish pass,"
"ship pass" — invoke the `site-pass` skill (this repo's own roadmap). It
covers both starting a pass (read STATUS, read plan, execute) and ending
one (the consolidation ritual). For cairn-cms library work (passes 0/A–F,
tracked in `cairn-cms/docs/PLAN.md`), use `cairn-pass` instead.

**On-demand reading:**
- `docs/STATUS.md` — current pass, pass table, next starter prompt.
  Load at the start of every pass.
- `docs/architecture.md` — design decisions and system overview.
  Load when planning structural changes.
- `docs/superpowers/specs/` — feature specs. Load the relevant spec
  before starting implementation.
- `BACKLOG.md` — known issues and future work. Check before starting
  a pass — may contain relevant known limitations.
- `.claude/rules/design-system.md` — auto-loads when editing
  `.svelte`/`.css`. Contains color token, typography, and shared
  class binding facts.

## Build & Dev

```bash
npm install
npm run dev                                    # dev server at http://localhost:5173
npm run build                                  # build to build/
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

## Content Pipeline

- **Posts** (`src/content/posts/*.md`) — remark + remark-gfm. Straight prose only.
- **Special pages** (`src/routes/about/`, `src/routes/archives/`) — mdsvex. Svelte components handle form and archive listing; prose is edited in-repo.

## cairn-cms admin

907.life is **consumer #2** of cairn-cms (the embedded magic-link, GitHub-committing CMS;
see `../cairn-cms/docs/PLAN.md`). Editors sign in by email at `/admin` (no GitHub account)
and edit raw markdown in a Carta editor; saving commits to `main` via the shared GitHub App
(`cairn-cms[bot]`), which auto-deploys.

- **Adapter:** `src/lib/cairn.config.ts` — posts collection only (filename-based ids, plain
  remark-html-equivalent preview, **free-form tags**), backend `glw907/907-life`.
- **Validator:** `src/lib/content-schema.ts`. Reads are anonymous (public repo, like
  ecnordic); the GitHub App install token is minted only for the commit path.
- **Routes:** `src/routes/admin/**`. **Guard:** `/admin/**` in `hooks.server.ts`.
- **Bindings:** `AUTH_KV` (allowlist `editor:<email>` → name) + `EMAIL` in `wrangler.toml`.
- **Replaces Sveltia** (removed in Pass F — the dead `static/admin/` is gone).

## Worker & Secrets

Two secrets required — check with `npx wrangler secret list`:
- `TURNSTILE_SECRET_KEY`
- `CONTACT_EMAIL`

Set with: `npx wrangler secret put SECRET_NAME`

## Deploy

Push to `main` → GitHub Actions runs build + pagefind + wrangler deploy → live in ~2 min.

Manual: `npm run build && npx pagefind --site .svelte-kit/cloudflare && npx wrangler deploy`

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
| `html-injection` | Edit `.svelte` | `{@html}` usage — prompts XSS checklist |
| `hardcoded-oklch` | Edit `.svelte`/`.css` | Raw `oklch()` values (use `var(--color-*)` tokens) |
| `svelte-check-reminder` | Session stop | Reminds to run `/svelte-check` before declaring done |

**Design system anchors:**
- Colors: 17 semantic tokens (`--color-*`) in `@theme`, dark overrides via `@plugin "daisyui/theme"`
- Typography: Spectral (body), Karla (display), Monaspace Neon (mono)
- Tokens: `var(--color-*)` for all colors, DaisyUI v5 semantic classes for layout, scoped `<style>` for design-specific rules
- Never use DaisyUI v4 short CSS vars (`--bc`, `--p`, etc.) — renamed in v5, silently resolve to nothing
- Never hardcode `oklch()` in component styles — define new tokens in `@theme` block

## Cross-Site Admin

For DNS, domain verification, or Cloudflare service config: `cd ~/Projects/cloudflare-sites && claude`
