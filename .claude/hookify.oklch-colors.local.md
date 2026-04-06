---
name: oklch-colors
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|css)$
  - field: new_text
    operator: regex_match
    pattern: (?<![{&])\B#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])|:\s*rgb\(|:\s*rgba\(|:\s*hsl\(
---

**Hex or legacy color format detected. This project uses oklch().**

All colors in `.svelte` and `.css` files should use the `oklch()` color space for perceptual consistency across the design.

**Convert to oklch:**
- `#1a1a2e` → `oklch(12% 0.02 265)`
- `#ffffff` → `oklch(100% 0 0)`
- `rgba(0,0,0,0.5)` → `oklch(0% 0 0 / 0.5)`

The existing palette uses hue 230 (cool blue-grey) for UI chrome and 61 for warm content text. Match those anchors when adding new colors.

Tool: https://oklch.com — paste a hex value to get the oklch equivalent.
