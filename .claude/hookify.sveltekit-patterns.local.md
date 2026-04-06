---
name: sveltekit-patterns
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|ts|js)$
  - field: new_text
    operator: regex_match
    pattern: from ['"][$]app/stores['"]|goto\(['"]https?://|import\s+.*\s+from\s+['"](?:node:)?fs['"]
---

**SvelteKit anti-pattern or Cloudflare Workers incompatibility detected.**

**`$app/stores` is deprecated** (removed in SvelteKit 3):
```ts
// WRONG
import { page } from '$app/stores';
$page.data.foo

// CORRECT (SvelteKit 2.4+)
import { page } from '$app/state';
page.data.foo
```

**`goto()` with external URLs** (runtime error in SvelteKit 2):
```ts
// WRONG — SvelteKit 2 restricts goto() to internal routes
goto('https://example.com');

// CORRECT
window.location.href = 'https://example.com';
```

**`fs` import in server code** (crashes on Cloudflare Workers):
Cloudflare Workers have no filesystem. All file access must happen at build time via `import.meta.glob`. If you need `fs`, this code cannot run on Cloudflare Workers without `nodejs_compat` and the access must be replaced with a bundled alternative.
