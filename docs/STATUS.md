# 907.life: Project Status

**Current state:** Live in production on `@glw907/cairn-cms ^0.81.0`, on the chassis/theme
structure (`src/chassis/` + `src/theme/`, Pass 20), with the Spectral/Karla/Monaspace
identity theme restored (Pass 19), a themed root `+error.svelte` for 404s, and the
sticky-header/type-scale fixes that shipped alongside the chassis restructure. **The rebuild
is deployed and stable; there is no pending work.** Future work rides cairn-cms's own release
cadence (a version bump this site adopts) rather than a queued site-side task. **A cairn-cms
site**, consumer #2, magic-link admin at `/admin` (posts concept, curated tag vocabulary,
media library, single-mount admin). The engine's rolling status is
`../cairn-cms/docs/STATUS.md`.

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
| 18 | Rebuild from Waymark on cairn-cms ^0.80.0 | ✓ Done (2026-07-05) |
| 19 | Typographic-audit polish (Spectral/Karla/Monaspace, old idioms) | ✓ Done (2026-07-05) |
| 20 | Chassis restructure, repoint to ^0.81.0, themed 404 | ✓ Done (2026-07-06), **deployed** |

> **Deploy status.** Pass 18–20's rebuild is live on `https://907.life` (verified: the served
> HTML carries the chassis's `min-h-screen`/`site-header`/`site-main` shell, the `907`/`.life`
> wordmark, and the `cairn-site-theme` toggle cookie mechanism). The "deploy HELD for Geoff's
> go" language that Passes 18–19 carried no longer applies; this landing sweep (below) found
> the deploy already current and corrected the record.

> **Landing sweep (2026-07-06).** A pre-handoff docs/infra pass, not a design or content
> change. Verified the production deploy is current (see above), then brought the docs back
> in sync with it:
> - `CLAUDE.md`: documented the chassis/theme project structure, corrected every pre-rebuild
>   reference this sweep found (`src/lib/*` paths, the `silk`/`dim` DaisyUI theme names, the
>   `build/` output path, mdsvex as an active pipeline rather than an unused wire), added a
>   **Design work** section pointing future design changes at cairn-cms's polish/fidelity,
>   one-check, and responsive-standard doctrines, and corrected the secrets list (the
>   GitHub App secrets were undocumented; four secrets on the live Worker (`AUTH_SECRET`,
>   `MAGIC_LINK_SECRET`, `SESSION_SECRET`, `RESEND_API_KEY`) are unused leftovers from
>   retired auth/email systems, zero references in `src/`, flagged but not deleted since
>   removing a live Worker secret is outside a docs sweep's authority).
> - `docs/architecture.md`: rewrote the Routing, Content Pipeline, CMS, and Design System
>   sections for the chassis/theme split (they still described the pre-Pass-18 `src/lib`
>   shape, the `silk`/`dim` themes, and a hand-rolled `src/lib/config.ts`/`utils.ts`); framed
>   the pre-Pass-18 CMS history explicitly as historical rather than current.
> - `.claude/rules/design-system.md` and `.claude/hookify.site-constants.local.md`: same
>   staleness (both auto-load on `.svelte`/`.css`/`.ts` edits and were actively wrong),
>   rewritten to the current token layering and `site.config.yaml`.
> - `scripts/mint-session.mjs`: rewritten for the self-owned D1 session model (an opaque
>   `session(id, email, expires_at, created_at)` row, no signing, per
>   `../cairn-cms/docs/internal/admin-smoke-test.md`); the old script forged a better-auth
>   HMAC-signed cookie against a session/auth model this site retired at the Pass-16.2
>   crossing. Re-verified end to end against the local D1: minted an owner session, printed
>   the cookie, confirmed the error path for a missing role, cleaned up the row.
> - `BACKLOG.md`: closed the one open item (`#1`, verify Pass 9 dark mode on the live site) as
>   superseded; Pass 9's implementation no longer exists, replaced by the chassis's own
>   `theme-toggle.ts` mechanism, and the toggle is confirmed present and working in the live
>   HTML.
>
> **One finding not carried forward as a claim.** The dispatch for this sweep described a
> "sticky-footer fix" alongside the type-scale fixes as already shipped. No such mechanism
> exists on this site: cairn-cms's `composition.css` gained a `.cairn-site-shell`/
> `.cairn-site-main` sticky-footer flex-column recipe for the AstroPaper theme port, but the
> showcase itself (and this site's copy of it) has never adopted it, and 907's own
> `(site)/+layout.svelte` has no `flex flex-col`/`flex-1` wrapper. On a short page the footer
> sits in normal flow after the content, not pinned to the viewport bottom. Not a defect this
> sweep introduced or was asked to fix (the checklist scoped this pass to docs and the
> mint-session script), so it is left alone here; a future pass that wants the pinned-footer
> look can adopt the chassis's existing, already-verified `composition.css` recipe directly.
>
> **Full gate.** `npm run check`: 0 errors, 0 warnings. `npm test`: exit 0. `npm run build`:
> green. See this pass's commit for the exact counts.

> **Pass 20: chassis restructure (done, deployed).** Task 3 of
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
> match Pass 19's values exactly. The sitemap still serves 23 URLs.
>
> **The carried gap closed.** Pass 20 originally landed with `npm run check` failing 4 errors
> against the then-published `^0.80.0` (the `rehypePlugins`/`sitemapView` `extraRoutes`/
> `unlistedRoutes`/`CairnHead.titleTemplate` surface was real on cairn-cms's `main` but not yet
> published). Once cairn-cms cut `^0.81.0`, this site repointed to the published release
> (regenerated lockfile, verified with `npm ci`): `npm run check` (0 errors, 0 warnings, 511
> files), `npm test` (18/18, exit 0), `npm run build` (green). A themed root `+error.svelte`
> then ported cairn-cms showcase's 404 pattern (a fully prerendered site strips its own
> catch-all from the runtime-routable manifest, so `wrangler.toml` needs
> `assets.not_found_handling = "none"` to reach the Worker's own error page rather than an
> edge-served static 404), closing out Pass 20 and this rebuild's deploy.

> **Pass 19: typographic-audit polish (done).** Restored the pre-rebuild pairing
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

> **Pass 18: rebuild from Waymark (done).** Plan:
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
> declared as direct dependencies, matching the showcase's own `package.json`. (Pass 20 later
> replaced this hand-wired step with the engine's own default `rehypePlugins` table-scroll wrap;
> see the Pass 20 note above.) Re-verified after the fix: `scrollWidth` is 320 (no overflow) on
> every one of the 23 sitemap pages at a 320px viewport, and the live 0.59-era site's own post
> pages overflow to 405px at the same width (a bare unwrapped table plus a wide element in its
> chrome), so the rebuild's mobile reading surface is now measurably tighter than the live site's,
> the acceptance bar this pass set.
>
> **The local admin smoke (Pass 18, task 5), as far as it goes without production.** Per
> `../cairn-cms/docs/internal/admin-smoke-test.md`: the local D1 (`cairn-907-auth`) has the auth
> schema and a seeded owner (`geoff@907.life`); a session row minted and inserted cleanly. But
> 907.life's `wrangler.toml` declares a `custom_domain` route, so under `wrangler dev` the Worker
> resolves `event.url` to the production `https://907.life` origin regardless of the local request
> host, and the guard's deployed-http branch sends every `/admin` request (anon or authed) to the
> "HTTPS required" page, exactly as the smoke doc predicts for a custom-domain site. The D1 session
> mechanism itself is proven; the authed checklist needs the deployed https Worker (now live, so a
> future full admin smoke targets `https://907.life` directly with `scripts/mint-session.mjs
> --remote`, per the admin-smoke-test doc's custom-domain guidance).
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
   silently from Task 1 through Task 4. Resolved upstream: cairn-cms now runs table-scroll as a
   default `rehypePlugins` render step (see the Pass 20 note above), so a fresh site no longer has to
   remember to wire it.
2. **No custom rehype seam on `createRenderer`, independently re-confirmed.** Resolved upstream:
   cairn-cms's `rehypePlugins` seam (adopted by Pass 20) is exactly the candidate fix this finding
   asked for.
3. **The engine's sitemap surface only sees concept-derived routes.** `sitemapResponse` and the site
   resolver (`site.all()`, `posts.allTags()`) hand back concept permalinks; a site-owned route with no
   concept behind it (907's `/about`, `/archives`, `/tags`, `/tags/[tag]`) is invisible to both, so the
   site must hand-list every one of them in its own `sitemap.xml` route, with nothing tying that list
   to the actual route tree. Resolved upstream: `sitemapView`'s `extraRoutes`/`unlistedRoutes`
   parameters (adopted by this site pre-Pass-20, see `56e46cb`/`9b89745`/`bb69cc9`) are exactly this
   answer.
4. **Theme toggle: already landed, closing the loop.** The plan flagged the manual light/dark toggle
   as a known template gap and asked for it to land in the template itself, not as a 907 fork. Done in
   Pass 18, upstream, and consumed unchanged since (Pass 20 moved 907's own call site onto the shared
   `$chassis/theme-toggle` mechanism).

---

### Next starter prompt

> **Goal.** None queued. The rebuild is deployed, verified, and stable; this file's own
> landing sweep (2026-07-06) closed every carried follow-up from Pass 18–20. Future work on
> this site starts from a cairn-cms release this site wants to adopt (a version bump plus
> whatever consumer actions its own changelog lists), not from a standing to-do here.
>
> **Still a user step, not a scripted smoke.** A real magic-link login in a browser (request a
> link, click it, confirm the POST-confirm page, land authenticated) against the now-live
> `https://907.life/admin`, per `../cairn-cms/docs/internal/admin-smoke-test.md`'s closing
> note. Nothing here blocks on it; it is the one thing no script can replay.
