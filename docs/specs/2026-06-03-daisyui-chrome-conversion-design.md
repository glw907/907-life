# 907.life chrome on DaisyUI: design

**Status:** approved (brainstorm), plan deferred to post-migration
**Date:** 2026-06-03
**Pass:** 17 (runs after Pass 16, the cairn-cms ^0.24.0 migration)

## Goal

Rebuild 907's chrome (everything outside the rendered post prose) on DaisyUI v5
components, so the UI maps cleanly to a maintained component library going forward. The
look stays recognizably 907, not pixel-identical to today.

The owner's guiding principle: clean DaisyUI beats perfect reproduction. Use DaisyUI
components idiomatically with minimal overrides. Where a faithful reproduction would mean
heavy custom CSS, prefer the cleaner DaisyUI default and accept a similar-not-identical
result.

## Sequencing

This is Pass 17. It runs after the cairn-cms ^0.24.0 migration (Pass 16), which is
look-preserving. The migration lands and deploys first, giving a known-good visual
baseline. The DaisyUI restyle then starts from that baseline, so any visual regression is
unambiguously a DaisyUI change.

The file-level implementation plan for this pass is written after the migration lands, so
it targets the final post-migration files: the `[...path]` catch-all post page, the
migrated home and `ArchiveList`, and the engine-fed loaders. This spec captures the design;
most of it (the nav, forms, modal, theming, prose) is independent of the migration.

## Theming and tokens

Use the DaisyUI `silk` (light) and `dim` (dark) themes close to as-shipped. `silk` is a
warm, low-chroma theme that already sits near 907's scholar's-study feel. The work here is
light:

- Keep the three self-hosted fonts (Spectral body, Karla display, Monaspace mono) through
  the `@theme` font vars. The fonts carry most of 907's character at near-zero maintenance.
- Trim the 17 custom oklch tokens down to a small set. Component colors come from DaisyUI's
  semantic slots (`base-100/200/300`, `base-content`, `primary`, `neutral`, `success`,
  `error`) and opacity modifiers (a muted label is `text-base-content/60`, not a custom
  `--color-muted`). Keep a custom token only where DaisyUI has no slot for it, for example a
  prose highlight if one is used.
- Do not force exact radii or exact colors to match today. Take DaisyUI's defaults.

The net effect: far less bespoke CSS to own, the palette lives in two theme blocks, and
the components inherit it.

## Post body

The rendered-markdown post body moves to the Tailwind Typography `prose` plugin. The
~130-line hand-tuned `.post-body` block in `app.css` is removed. The body wrapper becomes
`<div class="prose">`, themed lightly with the Spectral serif and the DaisyUI base colors.

This is the largest maintenance win and the cleanest mapping. The reading look stays
similar, with standard typographic defaults rather than the current hand-tuned measure.
DaisyUI documents `prose` integration, so the two coexist. The rendered HTML string is
unchanged, so the render characterization snapshot still holds; only the wrapper class and
the CSS change.

Adds `@tailwindcss/typography` as a dependency, loaded via `@plugin "@tailwindcss/typography"`
in `app.css`.

## Component mapping

DaisyUI components, styled with defaults and only light tweaks:

- `Nav.svelte` to `navbar` plus `menu` (horizontal). Search trigger to `btn btn-ghost`. The
  theme toggle to `swap swap-rotate`.
- `ContactForm.svelte` to `fieldset` and `label`, `input`, `textarea`, a submit `btn`,
  errors to `alert alert-error`, success to `alert alert-success`. The Turnstile widget is
  unchanged.
- `SearchModal.svelte` to `modal` (dialog-based). The Pagefind results render inside it.
- Post summaries on the home page and the archive and tag listings use `card` or
  `list`/`list-row`, whichever reads cleanest per surface. Cards are welcome where they
  make sense; dense rows can stay a list. The implementer picks the idiomatic DaisyUI fit at
  plan time under the clean-DaisyUI principle.
- Tags (the index, the tag detail, the in-post tag pills) to `badge`.
- The post page back-link to `btn btn-ghost` or `link`.

## What stays custom

- The `prose` post body, themed but not hand-built component by component.
- Page-level typographic headings (`.page-title` and the post header) stay light scoped CSS
  where no DaisyUI component fits. Keep these minimal.
- The nav logo's display-font treatment.

## Docs and rules

- `.claude/rules/design-system.md`: the "everything else: scoped per component" guidance
  becomes "DaisyUI components for chrome, `prose` for the post body, scoped CSS only where no
  component fits." Update the token section to reflect the trimmed palette and the
  DaisyUI-slot approach.
- `architecture.md`: update the Design System section to record the DaisyUI-component chrome,
  the `prose` post body, and the trimmed token set.
- The `daisyui-v5-classes` and `daisyui-v5-vars` hookify rules already guard v5 correctness
  and now apply across the chrome. No rule conflict, since no rule forbade DaisyUI components.

## Scope boundaries

- In: the public chrome (nav, footer, forms, modal, listings, tags, post page chrome),
  `app.css` theming, the post body via `prose`, and the doc and rule updates.
- Out: the `/admin` surface, which is engine-owned by cairn-cms and already uses DaisyUI. The
  cairn migration's data layer, routes, and content graph, all owned by Pass 16. The site's
  content and the contact-form behavior.

## Verification

- `svelte-check` reports 0 errors and 0 warnings.
- `vite build` succeeds and Pagefind still indexes the prerendered HTML.
- A manual visual pass on every page (home, post, archives, tags index, tag detail, about
  with the contact form, the search modal) in both `silk` and `dim`. The bar is a clean,
  coherent, recognizably-907 result, not a byte match to the old look.
- Fan out the `daisyui-a11y-reviewer` and `svelte-reviewer` at the review gate, on Opus.
