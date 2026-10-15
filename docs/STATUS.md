# STATUS

Present tense only. History lives in git and PR bodies, strategy in the initiative records (`glw907/initiatives`).

## Current state

- 907.life is a cairn-cms site (consumer #2) on the chassis/theme split: `src/chassis/` from the
  Waymark template and `src/theme/` for 907's adapter, chrome, and identity (`theme.css`,
  `907-theme.css`, `site.config.yaml`). Magic-link admin at `/admin`.
- `package.json` pins `@glw907/cairn-cms ^0.84.4` (commit `7b5c52e`). The registry's latest is
  `0.98.0`. The last deploy this repo records is Pass 20's; whether production carries the 0.84.4
  bump is unverified.
- The identity layer `907-theme.css` uses `!important` and hand-written `[data-theme]` overrides,
  which cairn's theme contract now forbids. The next pass replaces it rather than porting it.
- Open issues: `BACKLOG.md`.

## Next action

Start the 907.life rebuild (initiative `907-rebuild`) with a brainstorm session. The rebuild
includes the Survey re-skin and Survey's cairn layer (Survey S2, moved here from cairn-themes on
2026-10-07).

### Next action (907.life rebuild)

> **Goal.** Rebuild 907.life on the current cairn release, re-skinned on Survey, with Survey's
> cairn layer built as part of it.
>
> **Scope.** In: the rebuild, whose wider scope the brainstorm settles; Survey's cairn layer
> (chrome components, page compositions, prose and directive styling, the `--cairn-cta-*` keys and
> `--cairn-caption-tracking`, the code-highlight colors `--cairn-code-*`, the `/styleguide` panel,
> the chassis `exclude` list); 907's site layer (wordmark, copy, signature-detail settings); and
> the cairn bump it needs. Out: packaging Survey as a choosable cairn theme (Survey S3, cairn's
> work).
>
> **Read first.** In `~/Projects/cairn-themes`: the Survey spec
> `docs/superpowers/specs/2026-10-07-survey-design.md` ("Architecture" defines the cairn layer,
> "Phases" names S2), `docs/HISTORY.md`'s Survey S1 entry ("Do not rediscover"), and
> `survey-theme/core/`. The core is merged on cairn-themes `main`; 907.life copies it in under the
> copy-on-create rule (a header naming the source path and the cairn-themes commit, never edited
> here).
>
> **Settled (do not re-brainstorm):** the Survey spec's "Decisions taken in the brainstorm" and
> owner ruling 1 (selectors take a 2rem radius); S1's core as merged, including `--site-field-bg`
> and `--site-field-border`.
>
> **Still open, brainstorm these:** the rebuild's scope beyond the re-skin. Run `engine-consult`
> first, since the pass builds against cairn's theme contract, and bring the five cairn friction
> entries Survey S1 filed in cairn-cms's `docs/internal/docs-friction-log.md` (field ground and
> border roles, daisyUI's off-`base-300` component borders, `cairn-audit` strictness and finding
> codes, auditing a theme outside a site). Settle where the cairn layer's source lives during the
> pass (here, cairn-themes, or cairn-cms beside Waymark) and the cairn version to bump to, through
> `dependency-upgrade`.
>
> **Approach.** Brainstorm and plan in a fresh session at effort `high`, then execute through
> `site-pass`. Visual work invokes `visual-fidelity` against the Survey specimen. Launch
> directory: `~/Projects/907-life`. Model: `claude --model claude-opus-5-5`.
