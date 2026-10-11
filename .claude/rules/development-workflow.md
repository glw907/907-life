---
description: Development workflow for 907.life's own passes
paths: []
---

When the user says "continue development", "next pass", "start the
next pass", "finish pass", "ship pass", or "continue" in the context
of 907.life's own roadmap, invoke the `site-pass` skill, which builds on
`pass-core`. It covers starting a pass (read STATUS, read the plan) and
closing one (full suite once, whole-branch review, STATUS update, PR).
cairn-cms is a separate standalone repo; this site consumes
`@glw907/cairn-cms` from the npm registry by version range.
