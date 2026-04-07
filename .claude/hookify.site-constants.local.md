---
name: site-constants
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|ts)$
  - field: new_text
    operator: regex_match
    pattern: 907\.life|Geoffrey L\. Wright|'en-US'|\.(year|month|day|slug)\}\/\{|posts\.slice\(1\)|\/tags\/\{
---

**Hardcoded site-specific value or structural pattern detected.**

This value should come from `src/lib/config.ts` or a helper in `src/lib/utils.ts`:

| Detected | Use instead |
|---|---|
| `907.life` / `https://907.life` | `SITE_TITLE` / `SITE_URL` from `$lib/config` |
| `Geoffrey L. Wright` | `SITE_AUTHOR` from `$lib/config` |
| `'en-US'` | `SITE_LOCALE` from `$lib/config` |
| `.year}/{...month}/{...` (post URL) | `postUrl(post)` from `$lib/utils` |
| `/tags/{tag}/` inline | `tagUrl(tag)` from `$lib/utils` |
| `posts.slice(1)` | `posts.slice(HOMEPAGE_FEATURED_COUNT)` — import `HOMEPAGE_FEATURED_COUNT` from `$lib/config` |

**Exception:** If you're editing `src/lib/config.ts`, these values belong here — no action needed.

**Adapting for a new site:** Update the constants in `src/lib/config.ts` and the `pattern`
line in this hookify rule to match the new site's values.
