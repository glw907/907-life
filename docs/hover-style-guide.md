# Link & Hover Style Guide

## Strategy

All links provide two signals on hover/focus:
1. **Color shift** — `--color-link` → `--color-link-hover` (clearly distinct values)
2. **Underline appears** — non-color signal satisfying WCAG 1.4.1

Keyboard focus (`:focus-visible`) mirrors hover exactly.

## Link Categories

| Category | Default | On Hover/Focus |
|----------|---------|----------------|
| Prose links | color + underline | color shifts; underline persists |
| Nav links | `--primary` gray, no underline | shifts to `--color-link-hover` + underline |
| Tag links | gray or link color, no underline | color shifts + underline appears |
| UI/CTA links | link color, no underline | color shifts + underline appears |
| Overlay links | transparent, no underline | no change |

## Color Tokens

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--color-link` | `#134d85` | `#8ac1ff` | Default link color |
| `--color-link-hover` | `#1a6bc4` | `#c2dcff` | Hover/focus color — must be clearly distinct |

When updating colors, verify the two values are visually distinguishable at arm's length on a monitor.

## Rules

- **Never** make hover color differ by fewer than ~30 hex steps in perceived brightness
- **Always** pair a color change with a non-color change (underline) for WCAG compliance
- **Always** mirror `:hover` in `:focus-visible` for keyboard parity
- **Never** suppress `outline` without providing an equal or better visible focus indicator
- **Always** include `prefers-reduced-motion` exception when adding transitions

## Exceptions

- `.entry-link` — invisible full-card overlay; must never show underline (layout glitch)
- `.nav a` — default color is `--primary` gray (distinguishes nav from inline links), but hover shifts to `--color-link-hover` like all other links

## Where These Rules Live

All hover rules are in `assets/css/extended/custom.css` under the
`LINK & INTERACTIVE STATE STRATEGY` comment block.
