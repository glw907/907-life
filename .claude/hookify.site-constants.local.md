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
    pattern: 907\.life|Geoffrey L\. Wright|'en-US'
---

**Hardcoded site-specific value or structural pattern detected.**

This value should come from `src/theme/site.config.yaml` (read through `$theme/cairn.config.ts`'s
`siteConfig`) or a helper in `src/theme/format-date.ts`:

| Detected | Use instead |
|---|---|
| `907.life` / `https://907.life` | `siteConfig.siteName` / `ORIGIN` from `$chassis/content` |
| `Geoffrey L. Wright` | `siteConfig.author` |
| `'en-US'` | `siteConfig.locale` |
| A post URL | The post's own `permalink` (already carries the full path; no helper needed) |
| A tag URL | The literal `/tags/{tag}/` string (see `PostRow.svelte`; only the one call site) |

**Exception:** If you're editing `src/theme/site.config.yaml` or `src/theme/cairn.config.ts`,
these values belong here. No action needed.

**Adapting for a new site:** Update `src/theme/site.config.yaml` and the `pattern` line in
this hookify rule to match the new site's values.
