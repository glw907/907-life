---
description: Development workflow for 907.life's own passes
paths: []
---

When the user says "continue development", "next pass", "start the
next pass", "finish pass", "ship pass", or "continue" in the context
of 907.life's own roadmap, invoke the `site-pass` skill. It handles both
pass start (read STATUS, read plan, execute) and pass end (the
consolidation ritual: code-simplifier, svelte-check, STATUS update, plan
archival, commit + push). cairn-cms is a separate standalone repo; this site
consumes `@glw907/cairn-cms` from the npm registry by version range.
