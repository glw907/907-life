---
name: html-injection
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.svelte$
  - field: new_text
    operator: regex_match
    pattern: \{@html\s
---

**`{@html}` usage detected. Verify the source is safe.**

`{@html}` bypasses Svelte's XSS protection and renders raw HTML. This is intentional and correct when the HTML comes from your own remark/markdown pipeline (author-controlled content). It is dangerous when the source is user input or an external API.

**Checklist before proceeding:**
- [ ] The HTML source is `remark-html` output from `src/content/posts/*.md` (author-controlled) ✓
- [ ] `remark-html` is used without `{ sanitize: false }` (safe default strips raw HTML tags) ✓
- [ ] The value is NOT from form input, URL parameters, or an external API

If this is a new `{@html}` use outside the post body pipeline, justify it in a comment above the line.
