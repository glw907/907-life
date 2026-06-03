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
| 17 | Convert public chrome to DaisyUI components | ◇ Designed, plan after Pass 16 |

---

### Next pass (16): migrate onto cairn-cms ^0.24.0

> **Goal.** Move 907 from cairn-cms `0.6.0` to `^0.24.0` and onto the full idiomatic public surface
> (engine render, delivery read model, public routes, content graph, SEO head), keeping URLs and
> design intact.
>
> **Status.** Brainstormed and planned, ready to execute. The spec is
> `docs/superpowers/specs/2026-06-03-cairn-cms-0.24-migration-design.md` and the plan is
> `docs/superpowers/plans/2026-06-03-cairn-cms-0.24-migration.md`. Decisions are resolved in the spec
> (posts-only concept, about and archives stay mdsvex routes, content graph wired full and fail-closed,
> render via the engine `createRenderer`, `[...path]` catch-all).
>
> **Approach.** Execute the plan with `superpowers:subagent-driven-development`, one subagent per
> task, launched from `~/Projects/cairn/907-life/`. Run the install as a full root install from
> `~/Projects/cairn/` (the `@types/node` hoist). The pass-end `site-pass` ritual then corrects the
> stale `AUTH_KV` and Carta facts in `architecture.md` and `CLAUDE.md` (now D1 `AUTH_DB` and
> CodeMirror) and marks the pass done.

### Pass 17: public chrome on DaisyUI

> **Goal.** Rebuild 907's chrome on DaisyUI v5 components for clean, maintainable mapping. The look
> stays recognizably 907, not pixel-identical. Clean DaisyUI beats perfect reproduction.
>
> **Status.** Designed. Spec is `docs/superpowers/specs/2026-06-03-daisyui-chrome-conversion-design.md`.
> Settled: `silk`/`dim` near as-shipped, keep the three fonts, trim the 17 custom tokens to DaisyUI
> slots; post body moves to the Tailwind Typography `prose` plugin; chrome to navbar/menu, modal,
> badge, input/textarea/btn/alert, swap, and card or list per surface. Admin is engine-owned, out of
> scope.
>
> **Approach.** Runs after Pass 16 (look-preserving migration ships first, giving a known-good
> baseline). Write the implementation plan after the migration lands, against the final files, then
> execute with `superpowers:subagent-driven-development`. Review gate fans out `daisyui-a11y-reviewer`
> and `svelte-reviewer` on Opus.
