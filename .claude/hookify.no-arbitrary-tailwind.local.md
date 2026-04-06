---
name: no-arbitrary-tailwind
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|html)$
  - field: new_text
    operator: regex_match
    pattern: class="[^"]*\[[^\]]+\]|class='[^']*\[[^\]]+\]
---

**Arbitrary Tailwind value detected (e.g. `w-[123px]`, `text-[#fff]`).**

This project uses DaisyUI v5 semantic tokens and scoped `<style>` blocks for values that don't map to the design system. Arbitrary values create inconsistency and defeat the purpose of a design token system.

**Prefer:**
- DaisyUI semantic classes: `btn`, `card`, `badge`, `input`, `prose`, etc.
- Tailwind scale values: `p-4`, `text-sm`, `gap-2`, etc.
- Scoped CSS with `oklch()` values for anything design-specific

**Only use arbitrary values if:**
- You have a specific measurement from a design spec
- No semantic token exists and a scoped style would be disproportionate overhead

If you find yourself reaching for arbitrary values repeatedly, that's a sign a new CSS class or `@theme` token is warranted.
