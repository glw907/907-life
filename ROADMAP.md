# ROADMAP

> Strategic initiatives. Managed by `/log-project`. Issues tracked in `BACKLOG.md`.

## Active

### ECN Nordic standalone site `ecnordic-standalone`
Build ecnordic.ski as a standalone SvelteKit site forked from 907.life, with a new ECN
theme, to get it live in the near term. Will be migrated into cairn-cms as a site
package once the engine is battle-ready.

## Planned

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
