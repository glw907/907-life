# cairn-cms — Project Status

**Current state:** Pass 9 complete. CSS tokens + dark mode live.
Transitioning to Cairn CMS multi-site architecture.

---

## Passes

| Pass | Goal | Status |
|------|------|--------|
| 1–9 | SvelteKit rebuild, features, CSS token system | ✓ Done |
| 10 | Claude infrastructure: cairn-pass skill, BACKLOG, STATUS, rules | ✓ Done |
| 11 | Repo rename → cairn-cms; multi-site VITE_SITE build system | planned |
| 12 | ECN design: tokens, typography, org-site layout | planned |
| 13 | ECN features: calendar, static pages, Sveltia CMS config | planned |

---

### Next starter prompt (Pass 11)

> **Goal.** Rename repo to `cairn-cms` and restructure the codebase
> for environment-driven multi-site builds.
>
> **Scope.** Rename GitHub repo; move `src/content/posts/` to
> `src/content/907-life/posts/`; add `src/content/ecnordic/`
> scaffold; wire `VITE_SITE` env var into Vite config + `posts.ts`;
> add `$site-config` and `$site-theme` Vite aliases; create
> `wrangler.ecnordic.toml`; add second GitHub Actions workflow.
> ECN content/design/features are out of scope.
>
> **Settled (do not re-brainstorm):** See
> `docs/superpowers/specs/2026-05-13-multi-site-ecnordic-design.md`
> — Option A single-repo approach, VITE_SITE mechanism, file layout,
> two Worker configs.
>
> **Approach.** Invoke cairn-pass to start. Standard pass-end
> checklist applies.

---

## Spec + Plan Locations

`docs/superpowers/specs/2026-05-13-multi-site-ecnordic-design.md`
`docs/superpowers/plans/2026-05-13-pass-1-claude-infrastructure.md`
