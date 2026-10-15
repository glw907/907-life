# BACKLOG

> Project issue tracker. Managed by `/log-issue`.

## High

## Medium

- [ ] **#2** Add a devcontainer with pinned Node and wrangler `#improvement` `#907-life` *(2026-08-30)*
  Bluefin DX's endorsed tier for SvelteKit/Cloudflare work: the toolchain pins in the repo's
  `.devcontainer/`, not host mise. Use Docker (not Podman) for the VS Code integration and
  mind SELinux labels on bind mounts. Research: `~/.dotfiles/bluefin/devenv-research.md`.

- [ ] **#3** Add a pull-request workflow running `npm run check && npm test && npm run build` `#improvement` `#907-life` `#initiative:907-rebuild` *(2026-10-14)*
  A `pull_request` workflow. Until it lands, the full-suite home is the local close gate (lean pass ruling 11).
  Moved here from the retired roadmap (`pr-test-ci`).

## Low

## Closed

- **#1** Deploy Pass 9: verify dark mode on live site `#ops` `#907-life` (superseded, 2026-07-06)
  Pass 9's implementation no longer exists: Pass 18 replaced the whole app, and the
  light/dark toggle is now the chassis's own `theme-toggle.ts` mechanism. Confirmed present
  and working in the live production HTML (the `cairn-site-theme` cookie and the toggle
  button both render on `https://907.life`).
