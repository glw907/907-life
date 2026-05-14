# cairn-cms — Project Status

**Current state:** Pass 10 complete. Claude infrastructure in place.
Transitioning to Cairn multi-repo architecture.

---

## Passes

| Pass | Goal | Status |
|------|------|--------|
| 1–9 | SvelteKit rebuild, features, CSS token system | ✓ Done |
| 10 | Claude infrastructure: cairn-pass skill, BACKLOG, STATUS, rules | ✓ Done |
| 11 | Multi-repo architecture: VITE_SITE, overlay script, 907-life content repo, CI pipeline | next |
| 12 | ECN site package: ecnordic-ski repo, content scaffold, training calendar route | planned |
| 13 | ECN design: color tokens, typography, org-site layout | planned |
| 14 | Cairn CMS: editor interface, magic-link auth, service-account GitHub writes | planned |
| 15 | AKS site package: aksailingclub-org content migration, events calendar | planned |

---

### Next starter prompt (Pass 11)

> **Goal.** Restructure cairn-cms into a generic engine where each
> site's content and config live in an isolated GitHub repo.
>
> **Scope.** Wire `VITE_SITE` define and `$site-config`/`$site-theme`/
> `$site-lib` aliases into Vite; extract 907-life theme + config into
> `src/sites/907-life/`; update `posts.ts` for multi-site static globs;
> write `scripts/overlay.sh`; add `build-site.yml` CI workflow for
> `repository_dispatch`; create `glw907/907-life` content repo and
> populate it; wire the push trigger; verify end-to-end deploy.
>
> **Settled (do not re-brainstorm):** See
> `docs/superpowers/specs/2026-05-13-cairn-cms-multi-repo-architecture.md`
> — Option 4 (GitHub template + site package convention), CI-clone
> content delivery, overlay precedence model.
>
> **Note:** Editor auth (no GitHub login required) is a Cairn CMS
> concern deferred to Pass 14. This pass creates the content repos
> that Cairn CMS will write to via service account.
>
> **Plan:** `docs/superpowers/plans/2026-05-13-pass-11-multi-repo-architecture.md`
>
> **Approach.** Invoke cairn-pass to start. Standard pass-end
> checklist applies.

---

## Spec + Plan Locations

`docs/superpowers/specs/2026-05-13-cairn-cms-multi-repo-architecture.md`
`docs/superpowers/specs/2026-05-13-multi-site-ecnordic-design.md`
`docs/superpowers/plans/2026-05-13-pass-11-multi-repo-architecture.md`
`docs/superpowers/plans/2026-05-13-pass-1-claude-infrastructure.md`
