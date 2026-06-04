# 907.life: Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare, ET Book, CSS token
system). Passes 1–16 done. **A cairn-cms site**, onboarded as consumer #2 in cairn Pass F
(2026-05-25): magic-link admin at `/admin` (posts concept, free-form tags, private-repo reads).
Pass 16 (2026-06-03) migrated it to cairn-cms `^0.24.0` on the full public surface: engine render,
the `content.ts` delivery layer, the `[...path]` catch-all, a committed-manifest backstop, and the
engine feed/sitemap/robots helpers. URLs and design held. The engine's rolling status is
`../cairn-cms/docs/STATUS.md`; its locked design is the functional spec under
`../cairn-cms/docs/superpowers/specs/`. The older `../cairn-cms/docs/PLAN.md` is history only.

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
| 16 | Migrate onto cairn-cms ^0.24.0 (full surface) | ✓ Done |
| 17 | Convert public chrome to DaisyUI components | ◇ Designed, plan next |

> **Pass 16 note.** Live deployed via the standard push-to-main path. One post-deploy check remains:
> the admin smoke (sign in at `/admin`, create a dated post, confirm the new URL resolves and the
> editor preview matches the published render).

---

### Next starter prompt (Pass 17)

> **Goal.** Rebuild 907's public chrome on DaisyUI v5 components for a clean, maintainable mapping.
> The look stays recognizably 907, not pixel-identical. Clean DaisyUI beats perfect reproduction.
>
> **Scope.** Public chrome only: navbar/menu, theme swap, the post and list surfaces, the contact
> modal, badges, inputs, buttons, alerts. Post body moves to the Tailwind Typography `prose` plugin.
> Admin is engine-owned and out of scope.
>
> **Settled (do not re-brainstorm):** Spec is
> `docs/superpowers/specs/2026-06-03-daisyui-chrome-conversion-design.md`. Keep `silk`/`dim` near
> as-shipped and the three fonts; trim the 17 custom tokens to DaisyUI slots; map chrome to
> navbar/menu, modal, badge, input/textarea/btn/alert, swap, and card-or-list per surface.
>
> **Approach.** Invoke site-pass to start. Pass 17 has a spec but no plan yet, so write the
> implementation plan first, against the final post-migration files, then execute with
> `superpowers:subagent-driven-development`. The review gate fans out `daisyui-a11y-reviewer` and
> `svelte-reviewer` on Opus. Standard pass-end checklist applies.
