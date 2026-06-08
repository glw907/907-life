# 907.life: Project Status

**Current state:** Site rebuilt and deployed (SvelteKit + adapter-cloudflare, ET Book, CSS token
system). Passes 1–16 done. **A cairn-cms site**, onboarded as consumer #2 in cairn Pass F
(2026-05-25): magic-link admin at `/admin` (posts concept, free-form tags, private-repo reads).
Pass 16 (2026-06-03) migrated it to cairn-cms `^0.24.0` on the full public surface: engine render,
the `content.ts` delivery layer, the `[...path]` catch-all, a committed-manifest backstop, and the
engine feed/sitemap/robots helpers. URLs and design held. The engine's rolling status is
`../cairn-cms/docs/STATUS.md`; its locked design is the functional spec under
`../cairn-cms/docs/superpowers/specs/`. The older `../cairn-cms/docs/PLAN.md` is history only.

> **Architecture note (2026-05-24, updated 2026-06-04).** The earlier "Cairn multi-repo engine"
> direction (old passes 11–15) is **SUPERSEDED.** **cairn-cms** is an embedded magic-link CMS library,
> published to npm as `@glw907/cairn-cms`, and each site is its own standalone repo consuming it via a
> per-site adapter. 907.life is consumer #2. Superseded specs and plans under `docs/superpowers/` are
> history only.

---

## Passes (907.life's own build)

| Pass | Goal | Status |
|------|------|--------|
| 1–9 | SvelteKit rebuild, features, CSS token system | ✓ Done |
| 10 | Claude infrastructure: pass ritual skill, BACKLOG, STATUS, rules | ✓ Done |
| 11–15 | Multi-repo engine roadmap | ✗ Superseded |
| 16 | Migrate onto cairn-cms ^0.24.0 (full surface) | ✓ Done |
| 17 | Convert public chrome to DaisyUI components | ◇ Designed, plan next |

> **Pass 16 note.** Live deployed via the standard push-to-main path. One post-deploy check remains:
> the admin smoke (sign in at `/admin`, create a dated post, confirm the new URL resolves and the
> editor preview matches the published render).

---

## Queued: cairn-cms 0.33.0 upgrade (coordinate with Pass 17)

cairn-cms published `0.33.0` on 2026-06-08 (registry `latest`), folding the admin-stands-alone initiative
across `0.30.0` through `0.33.0` over the prior `0.29.0`. 907 pins `^0.24.0`, and a caret on a `0.x`
version locks the minor, so the range will not pull `0.33.0` on its own. The full per-version action list
is in `../cairn-cms/docs/guides/upgrade-cairn.md`; the items below are the ones that touch this site,
verified against its code on 2026-06-08.

**This overlaps Pass 17.** Pass 17 rebuilds the public chrome on DaisyUI and edits the same root layout.
The cairn `(site)`-group restructure (item 3) moves that chrome, so do it once: fold item 3 into Pass 17.
Items 1 and 2 are independent and small, so land them first or at the start of Pass 17. Item 2 in
particular unblocks building against `0.25.0` and later, which the current pin already fails.

1. **Bump the dependency.** Set `@glw907/cairn-cms` to `^0.33.0` in `package.json`, reinstall, and
   regenerate the committed manifest (`npm run cairn:manifest`). Confirm `scripts/build-manifest.mjs`
   still resolves its engine imports: the `0.27.0` surface-narrowing moved the delivery read surface off
   the root barrel, and the `0.26.0` DX-B pass added a `cairnManifest()` Vite plugin that can replace the
   hand-rolled script. Repoint the imports or adopt the plugin if the script breaks.

2. **Fix the `composeRuntime` call.** `src/lib/cairn.server.ts:14` uses the old positional form
   `composeRuntime(cairn, [], urlPolicyFrom(siteConfig))`. The object form landed at `0.25.0`. Change it
   to `composeRuntime({ adapter: cairn, siteConfig })` and drop the now-unused `urlPolicyFrom` import. This
   break is already latent against the current `^0.24.0` pin.

3. **Move host chrome out of `/admin`** (fold into Pass 17). The root `src/routes/+layout.svelte` imports
   `../app.css` and renders `<Nav>`, `<SearchModal>`, a width-constraining `<main class="container ...
   max-w-3xl">`, and a `<footer>`, all wrapping `/admin`. Create a `src/routes/(site)/+layout.svelte` group
   holding that chrome and move the public routes into it: `+page.svelte`, `+page.server.ts`, `[...path]`,
   `about`, `archives`, `tags` (and `+layout.server.ts` if it loads chrome data). Leave the root layout
   bare. Keep `admin/` and the endpoints (`feed.xml`, `feed.json`, `sitemap.xml`, `robots.txt`, `healthz`)
   at the route root. Group folders do not change any URL. A dev-only guard in the admin logs a console
   error until the root layout is chrome-free.

**Not affected, skip:** the `0.30.0` render-authoring import moves and the `rehypeDispatch` removal (907
imports neither and uses no `defaultIconByRole`). `0.31.0` and `0.32.0` are additive.

**Verify:** `npm run check` 0/0, `npm run build` exit 0, and the admin smoke already on the Pass 16
checklist (sign in at `/admin`, create a dated post, confirm the URL resolves and the admin renders
full-bleed with no 907 chrome around it).

---

### Next starter prompt (Pass 17)

> **Goal.** Rebuild 907's public chrome on DaisyUI v5 components for a clean, maintainable mapping.
> The look stays recognizably 907, not pixel-identical. Clean DaisyUI beats perfect reproduction.
>
> **Scope.** Public chrome only: navbar/menu, theme swap, the post and list surfaces, the contact
> modal, badges, inputs, buttons, alerts. Post body moves to the Tailwind Typography `prose` plugin.
> Admin is engine-owned and out of scope.
>
> **Settled (do not re-brainstorm):** Spec is
> `docs/superpowers/specs/2026-06-03-daisyui-chrome-conversion-design.md`. Keep `silk`/`dim` near
> as-shipped and the three fonts; trim the 17 custom tokens to DaisyUI slots; map chrome to
> navbar/menu, modal, badge, input/textarea/btn/alert, swap, and card-or-list per surface.
>
> **Approach.** Invoke site-pass to start. Pass 17 has a spec but no plan yet, so write the
> implementation plan first, against the final post-migration files, then execute with
> `superpowers:subagent-driven-development`. The review gate fans out `daisyui-a11y-reviewer` and
> `svelte-reviewer` on Opus. Standard pass-end checklist applies.
