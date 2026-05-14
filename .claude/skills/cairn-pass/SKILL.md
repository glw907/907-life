---
name: cairn-pass
description: >
  Invoke at the start or end of a cairn-cms development pass. Covers
  pass-end consolidation (simplify, svelte-check, STATUS update, plan
  archival, commit + push) and the starter-prompt format for the next
  pass. Trigger on "continue development", "next pass", "finish pass",
  "ship pass", or explicit invocation.
---

# Cairn Pass

Cairn-cms development proceeds in numbered passes. Each pass has a
starter prompt in `docs/STATUS.md`, a plan doc under
`docs/superpowers/plans/`, and (usually) a spec under
`docs/superpowers/specs/`. This skill encodes the ritual at both ends.

## Starting a pass

1. Read `docs/STATUS.md` — grab the current pass number and starter
   prompt.
2. Read the plan doc for the current pass. If none exists and the
   starter prompt lists open questions, brainstorm first (invoke
   `superpowers:brainstorming`) and write a plan at
   `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`.
3. Execute the plan using `superpowers:subagent-driven-development`.

## Ending a pass — the consolidation ritual

Every pass ends here. No pass is done until every step has run.

### 1. /simplify

Run the `simplify` skill on changed code. Docs-only passes skip this.

### 2. /svelte-check

Run the `svelte-check` skill. Fix any type errors before continuing.
Docs-only passes skip this.

### 3. Update docs/architecture.md

Add any design decisions made this pass that belong in the long-term
record. Keep it factual — decisions, not narration.

### 4. Update docs/STATUS.md

- Mark the current pass `done` in the pass table.
- Write the next starter prompt (see format below).
- STATUS.md must stay ≤60 lines. Prune if it grows.

### 5. Archive plan + spec

```bash
git mv docs/superpowers/plans/<this-pass>.md docs/superpowers/archive/plans/
# if a spec exists:
git mv docs/superpowers/specs/<this-pass>-design.md docs/superpowers/archive/specs/
```

### 6. Commit and push

```bash
git add -A
git commit -m "Pass <n>: <summary>

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

## Starter-prompt format

```markdown
### Next starter prompt (Pass <n>)

> **Goal.** One sentence describing what this pass accomplishes.
>
> **Scope.** What's in, what's out.
>
> **Settled (do not re-brainstorm):** Decisions already made.
>
> **Still open — brainstorm these:** Questions the pass must
> answer before coding. Omit section if none.
>
> **Approach.** "Invoke cairn-pass to start. Standard pass-end
> checklist applies."
```

## When NOT to use

- Mid-pass debugging or single-file edits.
- Purely doc changes (typo fix, content update) — no ritual needed.

## Cairn skill naming convention

Project-specific skills use the `cairn-` prefix and live in
`.claude/skills/cairn-*/`. This is `cairn-pass`; future skills
follow the same pattern (e.g. `cairn-design`, `cairn-deploy`).
