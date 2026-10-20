# 907.life: rebuild from Waymark on 0.80.0

> The first of the two rebuilds (Geoff, 2026-07-05): permalinks exact, visuals quite close
> and ultimately improved (especially responsive), and every template friction lands in the
> DEFAULTS at cairn-cms, never as a site fork. Production deploy is HELD for Geoff's go.
> Ground truth: the six-heading inventory (2026-07-05, in the cairn-cms session record).

**The architecture:** fresh Waymark scaffold pinned to `@glw907/cairn-cms@^0.80.0` from the
registry; 907's identity expressed as a theme layer over the neutral default (the second
proof of the theme pattern after the cairn theme); the bespoke surface re-derived on current
public exports; the 0.59-era code retired wholesale rather than migrated in place.

## The permalink contract (hard)

All 22 sitemap URLs reproduce exactly: `/`, `/about`, `/archives`, `/tags`,
eleven `/tags/<tag>/` pages (trailing slash), and eight `/:year/:month/:day/:slug` posts
(day-granular datePrefix). Plus the non-sitemap server routes: `/feed.xml`, `/feed.json`,
`/sitemap.xml`, `/robots.txt`, `/healthz`, `/media/[...path]`. Acceptance is a crawl diff:
every live URL fetched against the local preview, status and canonical-path identical.

### Task 1: Scaffold and config

Fresh Waymark copy (the 0.80.0 showcase shape) into a rebuild branch; the old app retires.
Carry: wrangler config (custom domain, AUTH_DB, EMAIL, MEDIA_BUCKET, ASSETS, and the second
`SEND_EMAIL` binding for the contact form), the Turnstile/contact secrets (names only;
values stay in the deploy environment), the committed lockfile convention. Adapter written
fresh in the v2 idiom: one `posts` concept via `defineConcept`/`fieldset` (title, date,
description required, tags with `taxonomy: true`, draft), permalink `/:year/:month/:day/:slug`
with day datePrefix, `githubApp(...)` target, the entry-aware render shape.
**Acceptance:** builds green from the registry package; `/admin` signs in via the dev backend.

### Task 2: Content and vocabulary

The eight posts migrate as-is (filenames are already the identity contract). The eleven live
tags become the curated vocabulary in `site.config.yaml` ({value,label} per 0.78's model).
The orphaned `src/content/pages/about.md` and the unreferenced `profile.jpg` are dropped;
the vestigial drizzle migration and the vendored `et-book-gh-pages` tree die (the fonts move
to `static/fonts` properly).
**Acceptance:** all posts render; the vocabulary admin shows the eleven tags; no orphan files.

### Task 3: The bespoke surface on 0.80 exports

`/archives`, `/tags`, `/tags/[tag]` re-derived as site-owned routes on the CURRENT delivery
surface (verify each export against `docs/reference/delivery-data.md` first; the hand-rolled
`$lib/content.ts` retires). The sitemap must include the tag pages (if the inherited sitemap
can't carry site-added routes, that is a TEMPLATE FINDING to report, not a local hack to
bury). The media route takes the 0.79+ signature. Feeds come from the template's inherited
routes. The about page stays a static route carrying the contact form (Turnstile + the
SEND_EMAIL binding), ported as-is.
**Acceptance:** the crawl diff passes on every URL; feeds validate.

### Task 4: The 907 identity layer

A `907-theme.css` over neutral Waymark, per the cairn-theme pattern (one file + one import):
the et-book type, 907's palette expressed as the token ladder, and its dark counterpart.
The theme TOGGLE is a known template gap (the extensible-lens finding): implement the
mechanism IN THE TEMPLATE (a small cookie-persisted `data-theme` toggle in the Waymark
header, defaulting to the system scheme) and report it as the improvement; 907 consumes it.
Pagefind search ports as site-owned (`build:search` + the modal), and the pattern gets a
short write-up destined for the docs (the cairn.pub architecture wants the same search).
**Acceptance:** the side-by-side against the live site reads quite-close; the toggle works
in the template's own showcase too (the improvement lands at cairn-cms with its test and
docs rider, released or pending per the release doctrine).

### Task 5: Gates, smoke, and the held deploy

Full site gate (its own check/test suite in the repo's idiom, plus the permalink crawl diff
and a responsive spot-check at 320/1440/2560 — the rebuild must beat the live site's
responsive behavior, which predates the responsive pass). A local admin smoke via the D1
session-row process. CHANGELOG/STATUS in the site repo. **The production deploy waits for
Geoff.** Template findings from all tasks consolidate into one report back to cairn-cms
(the improvement loop's harvest, with the component-friction dimension standing even though
907's content uses no directives — the friction here is structural: toggle, sitemap seam,
search pattern).
