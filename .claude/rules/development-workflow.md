---
description: Development workflow for 907.life's own passes
paths: []
---

When the user says "continue development", "next pass", "start the
next pass", "finish pass", "ship pass", or "continue" in the context
of 907.life's own roadmap, invoke the `site-pass` skill. It handles both
pass start (read STATUS, read plan, execute) and pass end (the
consolidation ritual: code-simplifier, svelte-check, STATUS update, plan
archival, commit + push). For cairn-cms library work (passes 0/A–F,
tracked in `cairn-cms/docs/PLAN.md`), use the `cairn-pass` skill instead.
