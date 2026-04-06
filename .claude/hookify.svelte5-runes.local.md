---
name: svelte5-runes
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.svelte$
  - field: new_text
    operator: regex_match
    pattern: \$:\s
---

**Svelte 4 reactive syntax detected in a Svelte 5 project.**

`$:` reactive declarations are Svelte 4 syntax and do not work correctly with Svelte 5 runes mode.

Use Svelte 5 runes instead:

| Svelte 4 | Svelte 5 |
|---|---|
| `$: value = expr` | `let value = $derived(expr)` |
| `$: { sideEffect() }` | `$effect(() => { sideEffect() })` |
| `let x = $state` (store) | `let x = $state(initial)` |
| `export let prop` | `let { prop } = $props()` |

This project uses Svelte 5 runes throughout. Check `src/routes/+page.svelte` for reference patterns.
