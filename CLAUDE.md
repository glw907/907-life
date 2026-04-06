# 907.life

Personal blog — SvelteKit + TypeScript, deployed to Cloudflare Workers.

@docs/STATUS.md
@docs/architecture.md

## Stack

SvelteKit · TypeScript · Tailwind CSS v4 · DaisyUI v5 · mdsvex · remark + remark-gfm · Pagefind · Sveltia CMS · @sveltejs/adapter-cloudflare

## Build & Dev

```bash
npm install
npm run dev                                    # dev server at http://localhost:5173
npm run build                                  # build to build/
npm run build && npx pagefind --site build     # build + search index
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
- **Special pages** (`src/routes/about/`, `src/routes/archives/`) — mdsvex. Prose editable via Sveltia; Svelte components handle form and archive listing.

## Sveltia CMS

Config: `static/admin/config.yml`
Editor: `/admin/` (requires GitHub OAuth)
Collections: **posts** and **pages** (about + archives prose)

## Worker & Secrets

Two secrets required — check with `npx wrangler secret list`:
- `TURNSTILE_SECRET_KEY`
- `CONTACT_EMAIL`

Set with: `npx wrangler secret put SECRET_NAME`

## Deploy

Push to `main` → GitHub Actions runs build + pagefind + wrangler deploy → live in ~2 min.

Manual: `npm run build && npx pagefind --site build && npx wrangler deploy`

## Code Quality Rules

Hookify guards enforce these conventions automatically:

| Rule | Trigger | What it catches |
|---|---|---|
| `svelte5-runes` | Edit `.svelte` | `$:` reactive syntax (Svelte 4 — use runes instead) |
| `oklch-colors` | Edit `.svelte`/`.css` | Hex or `rgb()` colors (use `oklch()` throughout) |
| `no-arbitrary-tailwind` | Edit `.svelte`/`.html` | Tailwind arbitrary values like `w-[123px]` |
| `svelte-check-reminder` | Session stop | Reminds to run `/svelte-check` before declaring done |

Rules live in `.claude/hookify.*.local.md`. Disable individually by setting `enabled: false`.

**Design system anchors:**
- Colors: `oklch()` with hue 230 (UI chrome) and hue 61 (warm content text)
- Typography: Spectral (body), Outfit (display), Monaspace Neon (mono)
- Tokens: DaisyUI v5 semantic classes first, scoped `<style>` for anything design-specific

## Cross-Site Admin

For DNS, domain verification, or Cloudflare service config: `cd ~/Projects/cloudflare-sites && claude`
