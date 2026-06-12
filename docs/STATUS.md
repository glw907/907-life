# 907.life: Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare, Spectral/Karla/Monaspace,
CSS token system). Passes 1–16 done. **A cairn-cms site**, consumer #2, magic-link admin at `/admin`
(posts concept, free-form tags, private-repo reads). Pass 16 migrated it onto cairn `^0.24.0` on the full
public surface; the cairn-0.36.0 retrofit (2026-06-09) moved it to `^0.36.0`. The engine's rolling status
is `../cairn-cms/docs/STATUS.md`.

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
| 16.1 | cairn-0.36.0 retrofit (0.35.0 CSRF + 0.36.0 logging window) | ✓ Done (2026-06-09) |
| 16.2 | cairn ^0.51.0 crossing (single-mount admin + iframed preview) | ⟳ In progress; plan `docs/superpowers/plans/2026-06-12-cairn-0.51-crossing.md` |
| 17 | Convert public chrome to DaisyUI components | ◇ Designed, plan next |

> **cairn-0.36.0 retrofit (done).** Bumped `@glw907/cairn-cms` to `^0.36.0` and applied the window's
> consumer actions: `composeRuntime` object form (`0.25.0`); a `src/routes/(site)/` route group holding
> the public chrome so `/admin` renders chrome-free (`0.33.0`); `csrf: { checkOrigin: false }` in
> `svelte.config.js`, handing cairn's guard the admin CSRF authority (`0.35.0`); and `[observability]` in
> `wrangler.toml` so Workers Logs ingests cairn's structured events (`0.36.0`). Gate green: `npm run check`
> 0/0, `npm run build` exit 0 (every public URL prerendered at its path, no `(site)` leakage). Local admin
> smoke confirmed public pages keep their chrome and the guard runs; the full magic-link + authed-form CSRF
> verification stays a deployed-site Firefox step (local http hits the 0.34.0 HTTPS-required page because
> wrangler dev presents the worker as `https://907.life` via the `custom_domain` route). Details in
> `docs/architecture.md`. **Post-deploy check:** sign in at `/admin`, save a post, confirm the URL resolves
> and the admin renders full-bleed.

> **Follow-ups.** `scripts/mint-session.mjs` is stale (it targets the retired better-auth model); rewrite
> or drop it for the self-owned D1 session smoke. Two engine DX findings were filed to cairn-cms (the
> `csrf.checkOrigin` deprecation in kit 2.61, and the custom-domain local-smoke gap).

---

### Next starter prompt (Pass 17)

> **Goal.** Rebuild 907's public chrome on DaisyUI v5 components for a clean, maintainable mapping. The
> look stays recognizably 907, not pixel-identical.
>
> **Scope.** Public chrome only (navbar/menu, theme swap, post and list surfaces, contact modal, badges,
> inputs, buttons, alerts); post body moves to the Tailwind Typography `prose` plugin. Admin is
> engine-owned and out of scope. The chrome now lives in `src/routes/(site)/` after the cairn-0.36.0
> retrofit, so edit it there; the root layout stays bare.
>
> **Settled (do not re-brainstorm):** Spec is
> `docs/superpowers/specs/2026-06-03-daisyui-chrome-conversion-design.md`. Keep `silk`/`dim` near
> as-shipped and the three fonts; trim the 17 custom tokens to DaisyUI slots.
>
> **Approach.** Invoke site-pass to start. Write the implementation plan first against the post-retrofit
> files, then execute with `superpowers:subagent-driven-development`. The review gate fans out
> `daisyui-a11y-reviewer` and `svelte-reviewer` on Opus. Standard pass-end checklist applies.
