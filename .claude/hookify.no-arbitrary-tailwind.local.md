---
name: no-arbitrary-tailwind
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|html|ts|js)$
  - field: new_text
    operator: regex_match
    pattern: class="[^"]*\[[^\]]+\]|class='[^']*\[[^\]]+\]|`(?:bg|text|border|ring|p|m|w|h)-\$\{
---

**Arbitrary Tailwind value or dynamic class construction detected.**

Two patterns are flagged:

**1. Arbitrary values** (e.g. `w-[123px]`, `text-[#fff]`):
This project uses DaisyUI v5 tokens and scoped `<style>` blocks. Arbitrary values create inconsistency and bypass the design token system. Prefer DaisyUI semantic classes, Tailwind scale values, or scoped CSS with `oklch()` values.

If you need an arbitrary value repeatedly, add an `@theme` token in `app.css` instead.

**2. Dynamic class construction** (e.g. `` `text-${color}-500` ``):
Tailwind's scanner cannot detect dynamically-constructed class names. They will be purged from the production bundle and silently do nothing.

```js
// WRONG — purged in production
`text-${color}-500`

// CORRECT — full class names are statically visible
color === 'red' ? 'text-red-500' : 'text-blue-500'
```

Always use complete, static class name strings.
