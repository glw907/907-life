# Site-owned search with Pagefind

A short write-up of the pattern this site uses for full-text search, kept here so it can move into
cairn-cms's guides once a second site (cairn.pub) wants the same thing.

## Why Pagefind

Waymark's (site) pages prerender to static HTML at build time; there is no server-side database to
query at request time. [Pagefind](https://pagefind.app/) crawls a static build's HTML output after
the fact and writes a search index plus a small runtime module into that same output directory, so
it deploys as ordinary static assets with no extra infrastructure (no search-as-a-service account,
no Worker-side index).

## The wiring

1. **`build:search` runs after the normal build, against the adapter's output directory.**
   `vite build && npx pagefind --site .svelte-kit/cloudflare` (the `--site` path is the
   adapter-cloudflare output directory this site's `wrangler.toml` already points `[assets]` at, so
   the generated `/pagefind/` directory ships with everything else with no separate deploy step).
   Pagefind indexes every `<body>` element on every crawled HTML page; a site that wants to exclude
   chrome (nav, footer) from the index would scope this with a `data-pagefind-body` attribute, not
   needed here since the crawled pages are short enough that a little chrome noise does not hurt
   relevance in practice.
2. **The client never imports the generated module at build time.** `/pagefind/pagefind.js` does not
   exist until `build:search` has run, so it is fetched at *runtime*, lazily, on first search open:
   `await import(/* @vite-ignore */ pagefindPath)` where `pagefindPath` is a plain variable, not a
   string literal in the `import()` call. That indirection matters twice: `@vite-ignore` stops Vite
   trying to resolve the path at bundle time, and using a variable (not a literal) stops TypeScript
   trying to resolve a module declaration for it, so it types as `Promise<any>` instead of failing
   `svelte-check`.
3. **A plain `npm run dev` or `npm run build` (without the search step) has no index.** The component
   catches the failed dynamic import and shows a plain message rather than throwing, so local
   development and a search-less preview both degrade gracefully instead of erroring.
4. **The UI is site-owned, not Pagefind's bundled default UI.** Pagefind ships a themeable
   `@pagefind/default-ui` widget with its own CSS; this site instead calls Pagefind's lower-level JS
   API (`pagefind.init()`, `pagefind.search(query)`, `result.data()`) directly and renders the results
   in a DaisyUI `<dialog class="modal">` on the same token layer as the rest of the chrome
   (`src/lib/components/SearchModal.svelte`), so the results panel re-skins with everything else
   instead of carrying a second, unrelated design system. The result excerpt is rendered with
   `{@html}`: Pagefind generates that HTML (a `<mark>` around the matched terms) from the already-
   public, already-crawled page content at index time, not from live user input, so this carries no
   injection risk beyond what the crawled pages themselves already render.
5. **The trigger lives in the header, opens on click or Cmd/Ctrl+K.** The shortcut mirrors the
   admin's own command-palette convention (`CairnAdminShell.svelte`), so the two surfaces (admin,
   public) feel consistent to the one person (the site owner) who uses both.

## What a second site (cairn.pub) would copy

`SearchModal.svelte` as-is, the `build:search` package.json script (adjusted to that site's own
adapter output directory), and the `pagefind` devDependency. Nothing here is 907-specific except the
placeholder copy in the trigger's `aria-label` and the modal's placeholder text.
