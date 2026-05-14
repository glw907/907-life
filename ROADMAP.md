# ROADMAP

> Strategic initiatives. Managed by `/log-project`. Issues tracked in `BACKLOG.md`.

## Active

### ECN Nordic standalone site `ecnordic-standalone`
Build ecnordic.ski as a standalone SvelteKit site forked from 907.life, with a new ECN
theme, to get it live in the near term. Will be migrated into cairn-cms as a site
package once the engine is battle-ready.

## Planned

### Cairn CMS platform `cairn-cms`
Build the full Cairn platform: multi-repo engine (VITE_SITE, overlay script, CI
pipeline) followed by the editor interface (magic-link auth via Better Auth,
service-account GitHub writes). Covers passes 11–15. Both 907.life and ecnordic.ski
are planned migration targets once complete.
Spec: `docs/superpowers/specs/2026-05-13-cairn-requirements.md`

## Someday

### Migrate 907.life and ecnordic.ski to Cairn `site-migrations`
Restructure both standalone sites as cairn-cms site packages. Depends on cairn-cms
being stable and battle-tested.

### AKS Sailing Club site `aksailingclub`
Build aksailingclub.org as a Cairn site package, including content migration from the
existing Hugo site. The most complex migration — happens last, after cairn-cms is proven
and site-migrations is complete.
