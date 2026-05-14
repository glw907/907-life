---
description: Design system binding facts for cairn-cms
paths:
  - "src/**/*.svelte"
  - "src/**/*.css"
  - "src/app.css"
---

# Cairn CMS Design System

Binding facts for the cairn-cms design system. Auto-loads when
editing Svelte components or CSS.

## Color tokens

17 semantic tokens in `--color-*` namespace defined in `@theme` in
`src/app.css`. Dark overrides via `@plugin "daisyui/theme"`.

**Never use DaisyUI v4 short vars** (`--bc`, `--p`, `--b1`, etc.)
— renamed in v5, silently resolve to nothing.

**Never hardcode `oklch()` values** in component styles — define new
tokens in the `@theme` block in `src/app.css` and reference via
`var(--color-*)`.

**Never use hex or `rgb()` colors** — `oklch()` throughout.

## DaisyUI themes

- Light: `silk` (default)
- Dark: `dim` (prefers-dark)

Theme names are referenced in `@plugin "daisyui"` in `src/app.css`.
Overrides use `@plugin "daisyui/theme"`, not raw `[data-theme]` blocks.

## Typography

| Role | Font | Usage |
|---|---|---|
| Body | Spectral 400/700 | Prose, post content |
| Display | Karla 400–700 | Nav logo only |
| Mono | Monaspace Neon | Code blocks |

Self-hosted woff2 in `static/fonts/`. Font faces declared in
`src/app.css`.

## Shared CSS classes

Defined globally in `src/app.css` — use these, don't re-declare:
`.post-body`, `.post-date`, `.post-tags`, `.post-tag`, `.page-title`,
`.back-link`

Everything else: scoped `<style>` per component.

## Site constants

All site-specific values live in `src/lib/config.ts` (and per-site
configs once multi-site is wired). Never hardcode `SITE_URL`,
`SITE_TITLE`, etc. in components.
