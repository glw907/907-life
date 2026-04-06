---
name: svelte-check-reminder
enabled: true
event: stop
pattern: .*
---

Before declaring this work complete, run the `/svelte-check` skill (or `npm run check`) to verify there are no TypeScript or Svelte compiler errors.

This is especially important after:
- Adding or modifying `.svelte` files
- Changing types in `src/lib/types.ts`
- Adding new route files (`+page.server.ts`, `+page.svelte`)
- Importing from `$lib` paths that may not resolve yet

If the check is clean, proceed. If there are errors, fix them before committing.
