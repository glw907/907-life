# 907.life: Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare,
ET Book / plain `remark-html`, CSS token system). Passes 1–10 done. **Now a cairn-cms
site**, onboarded as consumer #2 in cairn Pass F (2026-05-25): magic-link admin at
`/admin` (posts concept, free-form tags, private-repo reads). The cairn-cms engine's rolling
status is `../cairn-cms/docs/STATUS.md`, and its locked design is the functional spec under
`../cairn-cms/docs/superpowers/specs/`. The older `../cairn-cms/docs/PLAN.md` is history only.
**Next queued pass:** migrate onto cairn-cms `^0.24.0`, the full current public surface; see the
"Next pass" section below.

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

### Next pass: migrate onto cairn-cms ^0.24.0 (the full current surface)

907 runs cairn-cms `0.6.0`, the admin and auth surface only. This pass jumps it to `^0.24.0`, the
published `latest` on npm, and adopts the whole public surface in one site-pass. The jump folds in
every engine release since 0.6.0: the `renderPreview`→`render` rename, the dated-slug URL identity,
the public delivery read-model and routes, the schema-source-of-truth adapter contract, the render
sanitize floor, the content-graph (committed manifest plus `cairn:` link resolution), the schema
validation tightening, and the SEO head consumer. It is a brainstorm-then-plan pass: brainstorm the
open decisions below, write the plan under `docs/superpowers/plans/`, then execute with `site-pass`.

**The worked reference is the ecnordic `^0.10`→`^0.21` migration**, the first full-surface consumer
migration. Its DX findings are `../cairn-cms/docs/dx-backlog-ecnordic-migration.md`, and the engine's
rolling status (`../cairn-cms/docs/STATUS.md`) carries the per-release detail and the migration
gotchas. 907 is the close parallel: plain `remark-html`, ET Book, free-form tags, `datePrefix: day`,
and no components. The render and component-authoring surface (0.24's `headRow`/directive work) is
mostly not applicable to 907, since 907 renders straight prose with no directive components.

**Where to run it (read this before launching).**

- Launch the session from `~/Projects/cairn/907-life/`, not the workspace root. That loads this
  repo's `CLAUDE.md`, its hookify hooks and rules, and the `site-pass` skill as the primary project,
  and git defaults to this repo. The ecnordic migration ran from the workspace root and worked, but
  the workspace `CLAUDE.md` then loads as the project and shadows the site's, so inside the repo is
  cleaner.
- Run the dependency install as a **full root install from `~/Projects/cairn/`** (`npm install` at the
  workspace root), not a standalone relock inside this repo. The root workspace hoists `@types/node`
  from cairn-cms's devDeps, and this site's `svelte-check` needs it; a standalone relock drops it and
  surfaces latent `node:fs` errors.
- Pin `^0.24.0`. The symlink-dev link is benign here: the local cairn-cms equals the registry
  `0.24.0`, so the site resolves identical bits whether through the registry or the workspace link.
  This repo's `node_modules` currently shadows a stale `0.6.0`, so the reinstall after the bump is
  required to pick up `0.24.0`.

**What the pass changes.**

- Bump `@glw907/cairn-cms` to `^0.24.0` in `package.json`.
- Adopt the schema-source-of-truth adapter contract (0.13/0.14): one `schema` member built with
  `defineFields`/`defineAdapter`, the inferred frontmatter type, every frontmatter key the site reads
  declared. 907 uses free-form tags, so declare a **`freetags`** field, not a `tags` field with
  `options`. A declared `tags` field enforces its `options` as a closed vocabulary by default since
  0.23, and `freetags` is the open escape hatch.
- In the adapter (`src/lib/cairn.config.ts`), rename `renderPreview` to `render` (renamed at 0.7.0).
  The `renderPostHtml` renderer stays.
- Set the per-concept URL policy in `src/lib/site.config.yaml`: posts take permalink
  `/:year/:month/:day/:slug` with `datePrefix: day`, read with `parseSiteConfig` and `urlPolicyFrom`.
  This reproduces 907's current URLs exactly, so there are zero redirects (files are already
  `YYYY-MM-DD-slug.md`).
- Build the read model with `createSiteIndexes` (pass every declared concept's `import.meta.glob`),
  create the loaders with `createPublicRoutes`, and adopt the response helpers (`rssResponse`,
  `jsonFeedResponse`, `sitemapResponse`, `robotsResponse`) and `CairnHead` from
  `@glw907/cairn-cms/delivery/head`. Replace the hand-rolled listing and tagging in `src/lib/posts.ts`
  and the feed logic in `src/lib/feed.ts` with the engine query and delivery surface. Keep
  `renderPostHtml`. The mdsvex about and archives pages are unaffected.
- Wire the SEO head consumer (0.14): `entryLoad` reads `image`/`robots`/`author`; set a site-default
  OG image.
- Wire the content-graph build path (0.18 to 0.21) even though 907 has no internal `cairn:` links yet:
  the committed manifest regenerate command plus the build-time `verifyManifest` and link resolver, so
  the fail-closed backstop is ready when the first internal link lands. The editor link picker and the
  delete/rename controls come with the admin surface.
- The render sanitize floor (0.17) cleans author HTML by default, so 907's plain `remark-html` path is
  covered. Extend the sanitize schema only if a benign tag the site uses is dropped.
- Run the live `/admin` smoke for the dated create flow against a real Worker.

**Routing model.** Replace the per-token `src/routes/[year]/[month]/[day]/[slug]/+page.ts` post route
with one catch-all `src/routes/[...path]/+page.ts` that calls `entryLoad` and exports `entries` (the
engine `entries()` yields `{ path }` records for a rest route). The date-archive routes (`[year]`,
`[year]/[month]`, `[year]/[month]/[day]`) and `tags/[tag]` stay as specific list routes, which
SvelteKit resolves ahead of the rest param. Confirm the prerenderer enumerates every post through the
catch-all before committing to it.

**Migration gotchas (carried from the ecnordic migration and the cairn STATUS).**

- Pass every declared concept's `import.meta.glob` to `createSiteIndexes` (an empty `{}` for an
  intentionally empty concept), or the build hard-fails on the missing glob key.
- Declare every frontmatter key the site reads in the concept schema.
- A hand-rolled `validate` must coerce an unquoted YAML `date` (a JS `Date`); `validateFields` does.
  Since 0.23 a non-canonical string `date` fails validation on save, so confirm committed posts carry
  a canonical `YYYY-MM-DD` date.
- Resolve `cairn:` links wherever a body renders to HTML. A `cairn:` token resolves content concepts
  only, so a hand-built SvelteKit route stays an absolute link (ecnordic's `/waiver` lesson).
- The dangling-`cairn:`-token build backstop is not fail-closed under an inherited
  `prerender.handleHttpError: 'warn'` (ecnordic flagged this). A surgical `handleHttpError` that
  rethrows only the cairn-link error keeps it fail-closed. Decide this at deploy.

**Open decisions to brainstorm first.**

- Concepts: do the about and archives mdsvex pages stay in-repo routes (the likely answer), or become
  a cairn `pages` concept? 907 enables `posts` only today.
- The fail-closed backstop posture above (whether to add the `handleHttpError` rethrow now).

**Gate and deploy.** Gate on `svelte-check` 0/0 and `vite build`, then push to `main` to deploy.
Verify a known dated post URL such as `/2025/01/10/winter-prior-lake` is byte-stable. Deploy is push to
`main` → GitHub Actions (build + pagefind + wrangler deploy).

**Stale docs to refresh during the pass.** `architecture.md` and the CMS sections of `CLAUDE.md` still
describe the Pass-F `AUTH_KV` auth, but the 0.6.0 cutover moved auth to self-owned D1 (`AUTH_DB`). They
also describe the Carta editor, which became CodeMirror at 0.9.0.
