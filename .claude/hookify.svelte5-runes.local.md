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
    pattern: \$:\s|\bexport\s+let\s+\w|\bon:[a-z]+=\{|createEventDispatcher|\$derived\s*\(\s*\(\s*\)\s*=>
---

**Svelte 4 syntax or rune misuse detected in a Svelte 5 project.**

This project uses Svelte 5 runes throughout. The pattern that triggered this rule is one of:

| Svelte 4 pattern | Svelte 5 replacement | Risk |
|---|---|---|
| `$: value = expr` | `let value = $derived(expr)` | Stale values in async contexts |
| `$: { sideEffect() }` | `$effect(() => { sideEffect() })` | Different update timing |
| `export let prop` | `let { prop } = $props()` | Two-way binding silently breaks without `$bindable()` |
| `on:click={handler}` | `onclick={handler}` | Event modifiers silently stop working |
| `createEventDispatcher` | Callback prop: `let { onmyevent } = $props()` | Type safety lost; runes-mode parents can't listen |
| `$derived(() => expr)` | `$derived(expr)` or `$derived.by(() => expr)` | Returns the function, not the value |

**Check:** `src/routes/+page.svelte` for correct rune usage examples.

Note: `export let` is also used legitimately in `.svelte` for re-exporting constants from a module script — only flag if this is in a `<script>` (not `<script context="module">`) and it looks like a prop declaration.
