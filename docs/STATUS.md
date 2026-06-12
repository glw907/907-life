# 907.life: Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare, Spectral/Karla/Monaspace,
CSS token system). Passes 1–16.2 done. **A cairn-cms site**, consumer #2, magic-link admin at `/admin`
(posts concept, free-form tags, single-mount admin since the cairn-0.51.0 crossing, 2026-06-12). The
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
| 17 | Convert public chrome to DaisyUI components | ◇ Designed, plan next |

> **cairn-0.51.0 crossing (done).** The whole `0.36.0` → `0.51.0` window in one pass: the admin shim
> tree became the two-file catch-all mount plus the `createCairnAdmin` composer, `app.d.ts` uses the
> engine's `/ambient` types, floors rose to svelte `^5.56.3` / kit `^2.12`, and the editor preview is
> wired to the site's real styling through the adapter `preview` knob (`app.css` is `?url`-only now).
> Review fold-in: theme cookie allowlisted before the `data-theme` attribute, `/admin` subtree
> `prerender = false` by layout, healthz error detail moved to the log. Details in
> `docs/architecture.md`; archived plan `docs/superpowers/archive/plans/2026-06-12-cairn-0.51-crossing.md`.
> Live-proven after deploy: `cairn-doctor --probe https://907.life` 12/12 (with `--from`/`--repo`;
> the D1 check ran via the new wrangler `account_id`), a real login POST returned `sent`, the
> back-to-back POST returned `throttled` (the 0.38 states), and both logged `auth.link.requested`
> in Workers Logs. **Post-deploy check (Geoff):** sign in at `/admin` (a fresh magic link is in the
> inbox from the proof), publish-workflow round trip, preview-fidelity eyeball on a real post.

> **Follow-ups.** `scripts/mint-session.mjs` is stale (it targets the retired better-auth model);
> rewrite or drop it for the self-owned D1 session smoke. The kit `csrf.checkOrigin` deprecation
> (kit#15992) stays on the cairn watch list. The site does not wire the `cairnManifest` Vite
> plugin, so `cairn-doctor` cannot self-derive `--from`/`--repo` here (four checks skip without
> flags); wire the plugin in a later touch, the ecxc setup is the model.

---

### Next starter prompt (Pass 17)

> **Goal.** Rebuild 907's public chrome on DaisyUI v5 components for a clean, maintainable mapping. The
> look stays recognizably 907, not pixel-identical.
>
> **Scope.** Public chrome only (navbar/menu, theme swap, post and list surfaces, contact modal, badges,
> inputs, buttons, alerts); post body moves to the Tailwind Typography `prose` plugin. Admin is
> engine-owned and out of scope. The chrome lives in `src/routes/(site)/`; the root layout stays bare.
>
> **Settled (do not re-brainstorm):** Spec is
> `docs/superpowers/specs/2026-06-03-daisyui-chrome-conversion-design.md`. Keep `silk`/`dim` near
> as-shipped and the three fonts; trim the 17 custom tokens to DaisyUI slots.
>
> **Approach.** Invoke site-pass to start. Write the implementation plan first against the
> post-crossing files, then execute task-by-task with `site-implementer`. The review gate fans out
> `daisyui-a11y-reviewer` and `svelte-reviewer`. Standard pass-end checklist applies.
