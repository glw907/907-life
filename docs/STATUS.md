# 907.life: Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare,
ET Book / plain `remark-html`, CSS token system). Passes 1–10 done. **Now a cairn-cms
site**, onboarded as consumer #2 in cairn Pass F (2026-05-25): magic-link admin at
`/admin` (posts collection, free-form tags, private-repo reads). cairn progress detail
lives in `../cairn-cms/docs/PLAN.md`, not here. **Next queued pass:** migrate onto cairn-cms
`0.8.0` (the delivery surface plus the dated-slug model); see the "Next pass" section below.

> **Architecture note (2026-05-24).** The earlier "Cairn multi-repo engine"
> direction (old passes 11–15: `VITE_SITE`, overlay script, site-packages,
> content repos, service-account writes) is **SUPERSEDED.** cairn is now a
> meta-workspace (`~/Projects/cairn/`) where **cairn-cms** is an embedded
> magic-link CMS *library* and each site is its own repo consuming it via a
> per-site adapter. **907.life is consumer #2**, onboarded as a cairn site in
> the cairn-cms roadmap's **Pass F** (done 2026-05-25), tracked in
> `../cairn-cms/docs/PLAN.md` and run via the **`cairn-pass`** skill (not a
> 907-local pass). Superseded specs/plans under `docs/superpowers/` are kept
> only as historical record.

---

## Passes (907.life's own build)

| Pass | Goal | Status |
|------|------|--------|
| 1–9 | SvelteKit rebuild, features, CSS token system | ✓ Done |
| 10 | Claude infrastructure: pass ritual skill, BACKLOG, STATUS, rules | ✓ Done |
| 11–15 | Multi-repo engine roadmap | ✗ Superseded (see note above) |

---

### Next pass: migrate onto cairn-cms 0.8.0 (delivery surface + dated slug)

907 runs cairn-cms `0.6.0`, the admin and auth surface only. This pass jumps it to `^0.8.0` and
adopts the public delivery surface and the dated-slug identity model together. `0.8.0` is published
to npm, so it consumes the registry directly with no symlink. The engine-side design and rationale
live in `../cairn-cms/docs/superpowers/specs/2026-05-31-cairn-dated-slug-design.md` and
`../cairn-cms/docs/superpowers/specs/2026-05-30-cairn-public-delivery-design.md`. Brainstorm the two
open decisions below, then write the plan under `docs/superpowers/plans/` and run it with `site-pass`.

What the pass changes:

- Bump `@glw907/cairn-cms` to `^0.8.0` in `package.json`.
- In the adapter (`src/lib/cairn.config.ts`), rename `renderPreview` to `render` (the engine renamed
  that field at 0.7.0). The `renderPostHtml` renderer itself stays.
- Add a `content:` block to `src/lib/site.config.yaml` carrying the per-concept URL policy, which now
  lives in the YAML rather than the adapter. Posts take permalink `/:year/:month/:day/:slug` with
  `datePrefix: day`. These reproduce 907's current URLs exactly, so there are zero redirects (the
  files are already `YYYY-MM-DD-slug.md`).
- Wire the build to read the YAML with `parseSiteConfig` and `urlPolicyFrom`, pass the policy to
  `composeRuntime`, build the posts index with `createContentIndex`, union it with `createSiteIndex`,
  and create the loaders with `createPublicRoutes`.
- Replace the hand-rolled listing and tagging in `src/lib/posts.ts` and the feed logic in
  `src/lib/feed.ts` with the engine query and delivery surface (`buildRssFeed`, `buildJsonFeed`,
  `buildSitemap`, `buildRobots`, `buildSeoMeta`). Keep `renderPostHtml`. The mdsvex about and archives
  pages are unaffected.
- Run the live `/admin` smoke for the dated create flow against a real Worker.

Two decisions to settle in the brainstorm first.

The routing model replaces the per-token `src/routes/[year]/[month]/[day]/[slug]/+page.ts` post route
with one catch-all `src/routes/[...path]/+page.ts` that calls `entryLoad` and exports `entries` (the
engine `entries()` yields `{ path }` records for a rest route). The date-archive routes (`[year]`,
`[year]/[month]`, `[year]/[month]/[day]`) and `tags/[tag]` stay as specific list routes, which
SvelteKit resolves ahead of the rest param. Confirm the prerenderer enumerates every post through the
catch-all before committing to it.

The concepts question is whether the about and archives mdsvex pages stay in-repo routes, which is the
likely answer, or become a cairn `pages` concept. 907 enables `posts` only today.

Gate on `svelte-check` 0/0 and `vite build`, then push to `main` to deploy, and verify a known URL
such as `/2025/01/10/winter-prior-lake` is byte-stable. One stale doc to refresh during the pass:
`architecture.md` still describes the Pass-F `AUTH_KV` auth, but the 0.6.0 cutover moved auth to
self-owned D1 (`AUTH_DB`).

**Deploy:** Push to `main` → GitHub Actions (build + pagefind + wrangler deploy).
