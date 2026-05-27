---
name: daisyui-v5-vars
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|css)$
  - field: new_text
    operator: regex_match
    pattern: var\(--[psan]\b|var\(--b[123c]\b|oklch\(var\(--
---

**DaisyUI v4 CSS variable syntax detected. This project uses DaisyUI v5.**

DaisyUI v5 renamed all CSS variables. The old short names silently resolve to nothing.

| v4 variable | v5 variable |
|---|---|
| `var(--p)` | `var(--color-primary)` |
| `var(--s)` | `var(--color-secondary)` |
| `var(--a)` | `var(--color-accent)` |
| `var(--n)` | `var(--color-neutral)` |
| `var(--b1)` | `var(--color-base-100)` |
| `var(--b2)` | `var(--color-base-200)` |
| `var(--b3)` | `var(--color-base-300)` |
| `var(--bc)` | `var(--color-base-content)` |

Also flagged: `oklch(var(--...))`. This project uses fixed `oklch()` values (e.g. `oklch(55% 0.008 230)`) rather than CSS variable lookups, which were found to be too faint on the silk theme. Use fixed `oklch()` values for design-critical colors.
