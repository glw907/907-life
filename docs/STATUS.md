# 907.life: Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare, ET Book, CSS token
system). Passes 1–10 done. **A cairn-cms site**, onboarded as consumer #2 in cairn Pass F
(2026-05-25): magic-link admin at `/admin` (posts concept, free-form tags, private-repo reads),
running cairn-cms `0.6.0`. The engine's rolling status is `../cairn-cms/docs/STATUS.md`; its locked
design is the functional spec under `../cairn-cms/docs/superpowers/specs/`. The older
`../cairn-cms/docs/PLAN.md` is history only.

> **Architecture note (2026-05-24).** The earlier "Cairn multi-repo engine" direction (old passes
> 11–15) is **SUPERSEDED.** cairn is a meta-workspace (`~/Projects/cairn/`) where **cairn-cms** is an
> embedded magic-link CMS library and each site is its own repo consuming it via a per-site adapter.
> 907.life is consumer #2. Superseded specs and plans under `docs/superpowers/` are history only.

---

## Passes (907.life's own build)

| Pass | Goal | Status |
|------|------|--------|
| 1–9 | SvelteKit rebuild, features, CSS token system | ✓ Done |
| 10 | Claude infrastructure: pass ritual skill, BACKLOG, STATUS, rules | ✓ Done |
| 11–15 | Multi-repo engine roadmap | ✗ Superseded |
| 16 | Migrate onto cairn-cms ^0.24.0 (full surface) | ▶ Planned, ready to execute |

---

### Next pass (16): migrate onto cairn-cms ^0.24.0

> **Goal.** Move 907 from cairn-cms `0.6.0` to `^0.24.0` and onto the full idiomatic public surface
> (engine render, delivery read model, public routes, content graph, SEO head), keeping URLs and
> design intact.
>
> **Status.** Brainstormed and planned. The spec is
> `docs/superpowers/specs/2026-06-03-cairn-cms-0.24-migration-design.md`. The task-by-task plan is
> `docs/superpowers/plans/2026-06-03-cairn-cms-0.24-migration.md`. Both open decisions are resolved
> in the spec (posts-only concept, about and archives stay mdsvex routes; content graph wired
> full and fail-closed).
>
> **Settled (do not re-brainstorm):** render moves to the engine `createRenderer`; the catch-all
> `[...path]` serves posts; `summaryFields: ['description']`; the prerender fails closed on a 5xx.
>
> **Approach.** Execute the plan with `superpowers:subagent-driven-development`, one implementer
> subagent per task. Launch the session from `~/Projects/cairn/907-life/`. Run the dependency
> install as a full root install from `~/Projects/cairn/` (the `@types/node` hoist). The pass-end
> `site-pass` ritual then refreshes `architecture.md` and `CLAUDE.md` (both still describe the
> Pass-F `AUTH_KV` auth and the Carta editor; the truth is self-owned D1 `AUTH_DB` and CodeMirror)
> and marks this pass done.
