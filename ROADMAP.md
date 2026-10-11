# ROADMAP

> Strategic initiatives. Managed by `/log-project`. Issues tracked in `BACKLOG.md`.

## Active

### 907.life rebuild on current cairn `907-rebuild`
Rebuild 907.life on the current cairn release. The Survey re-skin is part of it: the site moves
onto the Survey theme (topographic survey sheet, daisyUI 5 and Tailwind 4), and Survey's cairn
layer is built here as Survey S2 (moved from cairn-themes, 2026-10-07). Survey's portable core
shipped in cairn-themes Survey S1 and is copied in under the copy-on-create rule. The rebuild
replaces `907-theme.css`, whose `!important` and `[data-theme]` overrides the cairn theme contract
forbids. Starts with `engine-consult`; the brainstorm settles the rest of the rebuild's scope.
Spec: `~/Projects/cairn-themes/docs/superpowers/specs/2026-10-07-survey-design.md`.

### ECN Nordic standalone site `ecnordic-standalone`
Build ecnordic.ski as a standalone SvelteKit site forked from 907.life, with a new ECN
theme, to get it live in the near term. Will be migrated into cairn-cms as a site
package once the engine is battle-ready.

## Planned

### PR test CI `pr-test-ci`
Add a pull-request workflow that runs `npm run check && npm test && npm run build` on `pull_request`. Until it lands, the full-suite home is the local close gate (lean pass ruling 11).

### Cairn CMS platform `cairn-cms`
**SUPERSEDED direction (see `docs/STATUS.md` architecture note).** cairn-cms is no longer a
multi-repo engine + Better Auth + service-account writes; it is an **embedded magic-link,
GitHub-App-committing CMS library** consumed per-site via an adapter, tracked in
`../cairn-cms/docs/PLAN.md` (passes 0/A–F) and run via the `cairn-pass` skill, not 907-local
passes. 907.life was onboarded as consumer #2 in **Pass F** (2026-05-25); see the migration
entry below. Old spec `docs/superpowers/specs/2026-05-13-cairn-requirements.md` is historical.

## Someday

### Migrate 907.life and ecnordic.ski to Cairn `site-migrations`
Reframed: not "site packages" but per-site cairn-cms **adapters + embedded `/admin`**.
ecnordic.ski (consumer #1) and 907.life (consumer #2, this repo) are **both migrated** as of
cairn Pass F (2026-05-25). The aksailingclub site below remains the future migration.

### AKS Sailing Club site `aksailingclub`
Build aksailingclub.org as a Cairn site package, including content migration from the
existing Hugo site. The most complex migration. Happens last, after cairn-cms is proven
and site-migrations is complete.
