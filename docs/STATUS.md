# 907.life — Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare,
ET Book / plain `remark-html`, CSS token system). Passes 1–10 done. **No active
907-local roadmap** — the next chapter is becoming a cairn-cms site.

> **Architecture note (2026-05-24).** The earlier "Cairn multi-repo engine"
> direction (old passes 11–15: `VITE_SITE`, overlay script, site-packages,
> content repos, service-account writes) is **SUPERSEDED.** cairn is now a
> meta-workspace (`~/Projects/cairn/`) where **cairn-cms** is an embedded
> magic-link CMS *library* and each site is its own repo consuming it via a
> per-site adapter. **907.life is consumer #2** — it becomes a cairn site as
> part of the cairn-cms roadmap at **Pass E**, tracked in
> `../cairn-cms/docs/PLAN.md` and run via the **`cairn-pass`** skill (not a
> 907-local pass). Superseded specs/plans under `docs/superpowers/` are kept
> only as historical record.

---

## Passes (907.life's own build)

| Pass | Goal | Status |
|------|------|--------|
| 1–9 | SvelteKit rebuild, features, CSS token system | ✓ Done |
| 10 | Claude infrastructure: pass ritual skill, BACKLOG, STATUS, rules | ✓ Done |
| 11–15 | Multi-repo engine roadmap | ✗ Superseded — see note above |

---

### Next

No active 907-local pass. Day-to-day content/design work: invoke `site-pass`.
Becoming a cairn-cms site (per-site adapter, magic-link admin) arrives as
**cairn-cms Pass E** — see `../cairn-cms/docs/PLAN.md`.

**Deploy:** Push to `main` → GitHub Actions (build + pagefind + wrangler deploy).
