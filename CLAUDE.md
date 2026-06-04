# 907.life

Personal blog. SvelteKit + TypeScript, deployed to Cloudflare Workers.

@docs/STATUS.md
@docs/architecture.md

## Stack

SvelteKit · TypeScript · Tailwind CSS v4 · DaisyUI v5 · mdsvex · remark + remark-gfm · Pagefind · cairn-cms (magic-link admin) · @sveltejs/adapter-cloudflare

## Development Workflow

Pass-driven. Each pass has a starter prompt in `docs/STATUS.md`, a
plan under `docs/superpowers/plans/`, and usually a spec under
`docs/superpowers/specs/`.

The phrases "continue development," "next pass," "finish pass," and "ship
pass" invoke the `site-pass` skill (this repo's own roadmap), which covers
both starting a pass (read STATUS, read plan, execute) and ending one (the
consolidation ritual). For cairn-cms library work (tracked in
`../cairn-cms/docs/STATUS.md`, with locked design in its functional spec under
`../cairn-cms/docs/superpowers/specs/`), use `cairn-pass` instead.

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

- **Posts** (`src/content/posts/*.md`): rendered through the cairn-cms engine (`createRenderer`) via the `src/lib/content.ts` delivery layer. Straight prose, no directive components.
- **Special pages** (`src/routes/about/`, `src/routes/archives/`): mdsvex. Svelte components handle form and archive listing; prose is edited in-repo.

## cairn-cms admin

907.life is **consumer #2** of cairn-cms (the embedded magic-link, GitHub-committing CMS;
see `../cairn-cms/docs/STATUS.md`). Editors sign in by email at `/admin` (no GitHub account)
and edit raw markdown in a CodeMirror editor; saving commits to `main` via the shared GitHub App
(`cairn-cms[bot]`), which auto-deploys. (907 runs cairn-cms `^0.24.0` since the Pass 16 migration;
the editor preview calls the same engine render as the published page.)

- **Adapter:** `src/lib/cairn.config.ts` uses `defineAdapter`/`defineFields` for the posts concept (filename-based ids, **free-form tags**, engine `createRenderer` preview), backend `glw907/907-life`.
- **Validator:** the adapter's `defineFields` schema in `src/lib/cairn.config.ts` (the hand-rolled `content-schema.ts` is gone). Reads use the GitHub App installation token (5000/hr) when configured. Without it, anonymous reads 403 from Cloudflare's shared egress IPs hitting GitHub's 60/hr limit (fixed in cairn-cms 0.3.1); the same token also commits.
- **Routes:** `src/routes/admin/**`. **Guard:** `/admin/**` in `hooks.server.ts`.
- **Bindings:** `AUTH_DB` (self-owned D1: editor allowlist, sessions, single-use magic tokens) + `EMAIL` in `wrangler.toml`. The 0.6.0 cutover moved auth off the old `AUTH_KV` to D1.
- **Replaces Sveltia** (removed in Pass F; the dead `static/admin/` is gone).

## Worker & Secrets

Two secrets required. Check with `npx wrangler secret list`:
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
| `html-injection` | Edit `.svelte` | `{@html}` usage (prompts XSS checklist) |
| `hardcoded-oklch` | Edit `.svelte`/`.css` | Raw `oklch()` values (use `var(--color-*)` tokens) |
| `svelte-check-reminder` | Session stop | Reminds to run `/svelte-check` before declaring done |

**Design system anchors:**
- Colors: 17 semantic tokens (`--color-*`) in `@theme`, dark overrides via `@plugin "daisyui/theme"`
- Typography: Spectral (body), Karla (display), Monaspace Neon (mono)
- Tokens: `var(--color-*)` for all colors, DaisyUI v5 semantic classes for layout, scoped `<style>` for design-specific rules
- Never use DaisyUI v4 short CSS vars (`--bc`, `--p`, etc.); they were renamed in v5 and silently resolve to nothing.
- Never hardcode `oklch()` in component styles; define new tokens in the `@theme` block instead.

## Cross-Site Admin

For DNS, domain verification, or Cloudflare service config: `cd ~/Projects/cloudflare-sites && claude`
