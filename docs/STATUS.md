# 907.life: Project Status

**Current state:** Rebuilt from scratch on the Waymark starter template and `@glw907/cairn-cms
^0.80.0` (Pass 18, 2026-07-05), then polished against the site's original typographic audit (Pass
19, 2026-07-05). Fresh scaffold, DaisyUI v5 public chrome, a `907-theme.css` identity layer over
neutral Waymark (now Spectral/Karla/Monaspace Neon, not et-book) restoring the site's original
wordmark, nav, date-stamp, tag, blockquote, and code idioms, and every permalink the pre-rebuild
sitemap listed reproduced exactly. **The production deploy is HELD for Geoff's go**; the rebuild
is fully gated and verified locally but not pushed or deployed. **A cairn-cms site**, consumer #2,
magic-link admin at `/admin` (posts concept, curated tag vocabulary, single-mount admin). The
engine's rolling status is `../cairn-cms/docs/STATUS.md`.

> **Architecture note.** cairn-cms is an embedded magic-link CMS library published as
> `@glw907/cairn-cms`, and each site is a standalone repo consuming it via a per-site adapter. 907.life
> is consumer #2. The old "multi-repo engine" direction (passes 11–15) is superseded; those specs and
> plans under `docs/superpowers/` are history only.

---

## Passes (907.life's own build)

| Pass | Goal | Status |
|------|------|--------|
| 1–10 | SvelteKit rebuild, features, CSS tokens, Claude infra | ✓ Done |
| 11–15 | Multi-repo engine roadmap | ✗ Superseded |
| 16 | Migrate onto cairn-cms ^0.24.0 (full surface) | ✓ Done |
| 16.1 | cairn-0.36.0 retrofit (CSRF + logging window) | ✓ Done (2026-06-09) |
| 16.2 | cairn ^0.51.0 crossing (single-mount admin + iframed preview) | ✓ Done (2026-06-12) |
| 16.3 | cairn ^0.54.0 bump (editor-takes-the-shell window, additive) | ✓ Done (2026-06-13) |
| 17 | Convert public chrome to DaisyUI components | ✗ Superseded by Pass 18 |
| 18 | Rebuild from Waymark on cairn-cms ^0.80.0 | ✓ Done (2026-07-05), deploy HELD |
| 19 | Typographic-audit polish (Spectral/Karla/Monaspace, old idioms) | ✓ Done (2026-07-05), deploy HELD |
| 20 | Chassis restructure (Task 3 of cairn-cms's chassis-restructure plan) | ✓ Done (2026-07-05), deploy HELD |

> **Pass 20: chassis restructure (done, deploy held).** Task 3 of
> `cairn-cms/docs/superpowers/plans/2026-07-05-chassis-restructure.md`. Split `src/lib` into
> `src/chassis/` (the genre-free plumbing: `content.ts`, `feed.ts`, `cairn.server.ts`,
> `theme-toggle.ts`, `tokens.css`, `prose.css`, `composition.css`, verbatim from cairn-cms's
> showcase where genuinely site-agnostic) and `src/theme/` (907's own adapter config, chrome
> components, `theme.css`/`907-theme.css` values, `site-routes.ts`), with `$chassis`/`$theme`
> SvelteKit aliases mirroring the showcase's own. Deliberately omitted from the chassis copy:
> `dev-gate.ts` (no dev backend here) and `render.ts`'s icon wiring (907 registers no directive
> components); see `src/chassis/README.md` for the full boundary and the omission note.
> `SiteHeader.svelte`'s theme toggle now calls the shared `$chassis/theme-toggle` mechanism
> instead of carrying its own copy. The three old-idiom prose overrides (link underline,
> blockquote rule, inline-code chip) that Pass 19 had baked directly into `prose.css` move to
> `907-theme.css` as unlayered overrides of the chassis's `@layer components` defaults (the same
> layer-priority mechanism the font and color overrides already use), so `chassis/prose.css`
> stays the pure showcase copy. `tokens.css`'s generic design-scale/code-ramp/CTA defaults now
> live in the chassis; `theme.css` keeps only Waymark's real numbers plus the redundant blocks
> that duplicated chassis defaults were dropped (907 never actually overrode them).
>
> **Verification.** All 13 of Pass 19's restored devices re-verified by computed style against a
> local preview (wordmark faces, nav eyebrow case, entry-excerpt italics, footer-label case,
> post date/tag/back-link chrome, the blockquote's 2px muted rule, the inline-code chip's 0.76em/
> translucent/hairline treatment, and the link's transparent-to-muted underline reveal): all
> match Pass 19's values exactly. The sitemap still serves 23 URLs. `npm run check` (0/0),
> `npm test` (18/18, exit 0), and `npm run build` all pass when verified against cairn-cms's
> current (unreleased) source; see the carried note below for why the currently-committed
> `^0.80.0` dependency cannot yet reproduce that locally.
>
> **Carried (pre-existing, not introduced by this pass).** Three commits already on `main` before
> this pass (`67b8f0d`, `9b89745`, `bb69cc9`, plus `56e46cb`) consume `sitemapView`'s 4th
> `extraRoutes` argument, `unlistedRoutes`, `CairnHead.titleTemplate`, and the `rehypePlugins`/
> `tableScroll` engine defaults — all real on cairn-cms's `main` (cairn-cms's own
> `## Unreleased` changelog window, from its Harvest Pass 1) but not yet published to the
> `^0.80.0` npm release this site's `package.json` pins. Confirmed via `git stash` against the
> pre-pass commit that this gap pre-dates this pass: `npm run check` already failed with the
> same 4 errors before any chassis-restructure edit. Verified against a local tarball built from
> cairn-cms's current source (temporary, `--no-save`, reverted after) that every gate is green
> once that release lands; nothing else is blocking. Unblocks when cairn-cms cuts the release
> its own `docs/STATUS.md` already has queued ("the release Geoff ordered before aksailingclub").

> **Pass 19: typographic-audit polish (done, deploy held).** Restored the pre-rebuild pairing
> (Spectral body, Karla display, Monaspace Neon mono, self-hosted; et-book retired) and thirteen
> of the site's original devices the Waymark rebuild had dropped or genericized: the split
> `907`/`.life` wordmark (header and footer), the uppercase-eyebrow nav idiom, restored date/tag/
> back-link chrome on post pages, the underline-on-hover body link, long-format uppercase date
> stamps everywhere a post is listed, the hash-prefixed archive tag versus the bordered post-page
> tag pill, italic entry excerpts, the lowercase footer labels, and a dialed-back blockquote and
> inline-code treatment. Also root-caused and fixed a real defect along the way: `.prose p {
> margin-block: 0 }`'s type-selector specificity (0,1,1) always out-ranked the owl selector
> `.prose > * + *` (0,1,0) regardless of source order, so every paragraph following a paragraph,
> blockquote, code block, or table rendered with no top margin site-wide (most visible in the
> `understanding-epoll` post's back-to-back non-heading blocks). The fix (`:where(p)` to drop the
> reset's specificity to the owl selector's own) landed here and, since the bug is copied verbatim
> from the cairn-cms showcase template, in `cairn-cms` itself as a separate fix commit. Verified:
> side-by-side crops against a `97827da` worktree of the pre-rebuild site for every device, the
> live sitemap's 23 permalinks still serving 200 at their exact canonical path, and no horizontal
> overflow at 320/1440/2560.

> **Pass 18: rebuild from Waymark (done, deploy held).** Plan:
> `docs/superpowers/plans/2026-07-05-rebuild-from-waymark.md`. Five tasks: (1) retired the 0.59-era
> app wholesale for a fresh Waymark scaffold on the v2 adapter idiom (`defineConcept`/`fieldset`, one
> `posts` concept, `githubApp(...)`, entry-aware `render`); (2) migrated the eight posts as-is and
> curated the eleven live tags into `site.config.yaml`'s vocabulary, dropping the orphaned
> `about.md`/`profile.jpg`/vestigial drizzle migration/vendored font clone; (3) re-derived
> `/archives`, `/tags`, `/tags/[tag]` as site-owned routes on the 0.80 delivery surface, hand-extended
> `sitemap.xml` to carry them (see Template Findings below), and ported the contact form; (4) built the
> `907-theme.css` identity layer (et-book type, warm-cream/aurora-green palette, light+dark) over a
> new manual light/dark toggle implemented in the Waymark template itself, plus Pagefind search ported
> as site-owned; (5) this pass's gate, smoke, and verification, closing the loop.
>
> **The permalink crawl diff (Pass 18, task 5).** Every URL in the live `https://907.life/sitemap.xml`
> (23 entries: `/`, `/about`, `/archives`, `/tags`, 8 posts, 11 tag pages) plus `/feed.xml`,
> `/feed.json`, `/robots.txt`, `/healthz` served 200 on the local preview at the exact canonical path
> the sitemap declares, no redirect. The rebuilt `sitemap.xml` itself is byte-for-byte path-identical
> to the live one (same 23 `<loc>` paths). One incidental finding, not a rebuild defect: the
> currently-deployed 0.59-era site's own sitemap lists tag pages with a trailing slash
> (`/tags/alaska/`) but its own router 307-redirects that exact URL to the no-slash form, a pre-existing
> self-redirect bug the rebuild does not reproduce (the rebuilt tag route serves 200 directly at the
> sitemap's literal URL).
>
> **The responsive spot-check (Pass 18, task 5) found and fixed a real regression before this pass
> closed.** Screenshots at 320/1440/2560 on home, the `understanding-epoll` post, and `/tags` first
> looked clean, but a `document.documentElement.scrollWidth` check at 320px caught the post page
> rendering at 702px, well past the viewport: prose.css ships a `.table-scroll` wrapper class with a
> code comment noting "907 has none wired yet" (the render step that wraps every markdown table for
> the wrapper to apply to), and no task from 1 through 4 wired it, so every table rendered bare and
> blew out the page width on mobile. Fixed in this pass: `src/lib/render/table-scroll.ts` ported
> verbatim from the cairn showcase's own `table-scroll.ts`, wired into `cairn.config.ts`'s
> `rendering.render` after `renderMarkdown`, with the five packages it needs (`unified`,
> `rehype-parse`, `rehype-stringify`, `unist-util-visit`, `hast-util-to-string`, `@types/hast`)
> declared as direct dependencies, matching the showcase's own `package.json`. Re-verified after the
> fix: `scrollWidth` is 320 (no overflow) on every one of the 23 sitemap pages at a 320px viewport, and
> the live 0.59-era site's own post pages overflow to 405px at the same width (a bare unwrapped table
> plus a wide element in its chrome), so the rebuild's mobile reading surface is now measurably
> tighter than the live site's, the acceptance bar this pass set.
>
> **The local admin smoke (Pass 18, task 5), as far as it goes without production.** Per
> `../cairn-cms/docs/internal/admin-smoke-test.md`: the local D1 (`cairn-907-auth`) has the auth
> schema and a seeded owner (`geoff@907.life`); a session row minted and inserted cleanly. But
> 907.life's `wrangler.toml` declares a `custom_domain` route, so under `wrangler dev` the Worker
> resolves `event.url` to the production `https://907.life` origin regardless of the local request
> host, and the guard's deployed-http branch sends every `/admin` request (anon or authed) to the
> "HTTPS required" page, exactly as the smoke doc predicts for a custom-domain site. The D1 session
> mechanism itself is proven; the authed checklist needs the deployed https Worker, which is
> Geoff's step per the held-deploy boundary. Session row cleaned up; no stray state left in the
> local D1.
>
> **Full gate, every task.** `npm run check`: 0 errors, 0 warnings (553 files). `npm test`: 17/17
> passed, exit 0. `npm run build`: green (adapter-cloudflare output built; two upstream
> `INVALID_ANNOTATION` Rolldown warnings from `@glw907/cairn-cms`'s shipped `.svelte` files are
> informational, not build failures).

### Template findings (Pass 18, consolidated and ranked)

Reported back to cairn-cms per the plan's harvest step. Ranked by how much it would bite the next
Waymark-based rebuild.

1. **A scaffold-copy checklist gap let a real accessibility/responsive fix go unwired for four
   tasks (found and fixed here).** The Waymark template's `prose.css` documents the table-scroll
   wrapper as a two-part contract: the CSS class plus a render-time step that emits it, and it says so
   in an inline comment. A site that copies the CSS without separately copying (and wiring) the render
   step gets no error, no warning, and no visual hint until a real device or a narrow-viewport
   overflow check catches a bare `<table>` blowing out the page. Nothing in the rebuild plan's five
   task acceptance criteria named "wire the table-scroll render step" explicitly, so it rode along
   silently from Task 1 through Task 4. Recommend either: (a) the rebuild-plan template gets an
   explicit Task-1 acceptance line for every render-step file a scaffold copy depends on, not just the
   CSS, or (b) cairn-cms's showcase ships table-scroll as a default `rendering.render` behavior a site
   opts out of, rather than a file every consumer must remember to copy and wire (this also folds into
   finding 2 below).
2. **No custom rehype seam on `createRenderer`, independently re-confirmed.** Already filed at
   cairn-cms (`docs/internal/docs-friction-log.md`, 2026-07-05): `createRenderer` keeps its internal
   remark/rehype plugin ordering closed, so adding one rehype step (table-scroll) means a site
   re-parses and re-stringifies its own already-rendered HTML through a second `unified` pipeline. This
   pass hit the identical friction wiring 907's copy of the same fix, from the consumer side rather
   than the template side: a second, independent data point for the candidate fix already on file (an
   optional rehype-plugins parameter on the render pipeline factory).
3. **The engine's sitemap surface only sees concept-derived routes.** `sitemapResponse` and the site
   resolver (`site.all()`, `posts.allTags()`) hand back concept permalinks; a site-owned route with no
   concept behind it (907's `/about`, `/archives`, `/tags`, `/tags/[tag]`) is invisible to both, so the
   site must hand-list every one of them in its own `sitemap.xml` route, with nothing tying that list
   to the actual route tree. The showcase itself has no bespoke routes today so it never surfaces this;
   907 is the first real consumer to add site-owned public routes on top of the template and had to
   solve it locally (`src/routes/sitemap.xml/+server.ts`). Worth an engine-side answer before the next
   site adds its own routes: an optional extra-static-routes list the sitemap helper accepts, or a
   build check that flags a route directory with no corresponding sitemap entry.
4. **Theme toggle: already landed, closing the loop.** The plan flagged the manual light/dark toggle
   as a known template gap and asked for it to land in the template itself, not as a 907 fork. Done in
   this pass, upstream: `SiteHeader.svelte` gained a cookie-persisted `data-theme` toggle with a
   no-flash inline script in `app.html`, `theme.css` and the cairn theme both gained the matching
   `:not([data-theme])`/`[data-theme='cairn-dark']` dual guard, at cairn-cms `main` (commits
   `3496009`, `0af55f5`, unpublished, held with the rebuild for a coordinated release). 907 consumes
   the mechanism unchanged.

> **Follow-ups (carried).** `scripts/mint-session.mjs` is stale (it targets the retired better-auth
> model); rewrite or drop it for the self-owned D1 session smoke. The kit `csrf.checkOrigin`
> deprecation (kit#15992) stays on the cairn watch list. `docs/architecture.md`'s Pass F/16 lineage
> section (the "migrated to `^0.24.0`... retrofitted to `^0.36.0`" paragraph) is now stale relative to
> the Waymark/`^0.80.0` rebuild; a documentation touch should bring it current, out of scope for this
> verification pass. The full authed `/admin` checklist needs the deployed https Worker (see the local
> admin smoke note above) and is Geoff's step alongside the held deploy itself.

---

### Next starter prompt (the held deploy)

> **Goal.** Deploy the Pass 18 rebuild to production, replacing the 0.59-era app.
>
> **Settled (do not re-brainstorm).** Every gate in this file is green locally: `npm run check` (0/0),
> `npm test` (17/17, exit 0), `npm run build`, the 23-URL permalink crawl diff, and the 320/1440/2560
> responsive spot-check (now beating the live site after the table-scroll fix). The wrangler bindings
> (custom domain, `AUTH_DB`, `EMAIL`, `MEDIA_BUCKET`, `ASSETS`, the contact-form `SEND_EMAIL`) carried
> over unchanged from the pre-rebuild `wrangler.toml`.
>
> **Geoff's steps, in order.** (1) Review the rebuild branch and this pass's findings. (2) Push and
> deploy. (3) Run the full authed `/admin` checklist against the deployed `https://907.life` Worker
> (the local smoke could only prove the D1 session mechanism; the custom-domain guard needs https).
> (4) A real magic-link login in a browser, the one thing no scripted smoke can replay. (5) Decide
> whether to publish the held cairn-cms window (the theme toggle plus whatever else has accumulated)
> alongside or separately from this site's own deploy.
