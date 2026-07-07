---
description: Design system binding facts for 907.life's chassis/theme token layers
paths:
  - "src/**/*.svelte"
  - "src/**/*.css"
---

# 907.life Design System

Binding facts for the Waymark chassis/theme design system. Auto-loads when editing Svelte
components or CSS. Full detail: `docs/architecture.md`'s Design System section and
`src/chassis/README.md`.

## Color tokens

Design-scale keys (`--color-*`, `--text-step-*`, `--spacing-*`, `--font-*`) are declared with
generic defaults in `src/chassis/tokens.css`, redeclared with Waymark's real numbers in
`src/theme/theme.css`, then overridden again with 907's own values in `src/theme/907-theme.css`.
Two named DaisyUI themes: `cairn` (light) and `cairn-dark`.

**Never use DaisyUI v4 short vars** (`--bc`, `--p`, `--b1`, etc.). Renamed in v5, they
silently resolve to nothing.

**Never hardcode `oklch()` values** in component styles. Add or override a token in
`src/theme/theme.css` (or `907-theme.css` for 907's own identity layer) and reference it via
`var(--color-*)`.

**Never use hex or `rgb()` colors.** Use `oklch()` throughout.

## DaisyUI themes

- Light: `cairn` (default)
- Dark: `cairn-dark` (`prefersdark`, plus the explicit toggle)

Theme blocks live in `src/theme/theme.css` via `@plugin "daisyui/theme"` (never a raw
`[data-theme]` block, which loses the built-in theme variables DaisyUI's own block inherits).

## Typography

| Role | Font | Usage |
|---|---|---|
| Body | Spectral 400/700 | Prose, post content |
| Display | Karla 400–700 | Wordmark, headings |
| Mono | Monaspace Neon | Code blocks |

Self-hosted woff2 in `static/fonts/`; `@font-face` declarations in `src/theme/907-theme.css`.

## Shared components

`src/theme/components/`: `SiteHeader.svelte`, `SiteFooter.svelte`, `Wordmark.svelte`,
`PostRow.svelte`/`PostList.svelte` (the shared dated-post-row markup), `SearchModal.svelte`,
`ContactForm.svelte`. Reuse these; don't re-declare their markup in a route.

## Site config

Site-specific values (`siteName`, `description`, `author`, `locale`, the tag `vocabulary`,
`menus.primary`) live in `src/theme/site.config.yaml`, read through
`$theme/cairn.config.ts`'s `siteConfig`. Never hardcode them in a component.
