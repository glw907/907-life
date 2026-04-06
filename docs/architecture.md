# 907.life Architecture

Design decisions for the SvelteKit rebuild.

> **Pattern intent:** This site is a testbed. Architecture is documented as a
> reusable pattern for future personal blog sites, not just "how this site works."

---

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | SvelteKit + TypeScript | Modern, first-class Cloudflare support, Svelte 5 runes |
| Styling | Tailwind CSS v4 + DaisyUI v5 | CSS-first config, no tailwind.config.js needed |
| Markdown (posts) | remark + remark-gfm | Pure data pipeline, GFM support, no magic |
| Markdown (special pages) | mdsvex | Svelte components inside markdown for pages with interactive sections |
| Search | Pagefind | Post-build static index, zero runtime JS cost |
| CMS | Sveltia CMS | Git-based, modern Decap replacement, reusable config schema |
| Adapter | @sveltejs/adapter-cloudflare | First-class Workers support, form actions work natively |
| Contact form | Cloudflare Email Workers | Native Cloudflare, free tier, replaces Resend |
| Spam protection | Cloudflare Turnstile | Carried over from Hugo site |
| Fonts | Lora (woff2, self-hosted) | Carried over from Hugo site |

**Reusable core (the pattern):**
SvelteKit + TS + adapter-cloudflare · Tailwind v4 + DaisyUI v5 · remark/mdsvex pipeline
· Pagefind · Sveltia CMS config schema · Cloudflare Email Workers contact form
· GitHub Actions → Cloudflare Workers deployment

**Site-specific:** domain, content, fonts, Cloudflare secrets

---

## Routing

URL structure preserved from Hugo: `/:year/:month/:day/:slug/`

SvelteKit route: `src/routes/[year]/[month]/[day]/[slug]/+page.svelte`

Slug derived from filename: `2026-03-06-early-march.md` → `/2026/03/06/early-march/`

---

## Content Pipeline

### Posts — remark + remark-gfm

`src/content/posts/*.md` — loaded at build time via `import.meta.glob` with `?raw` +
`eager: true`. All markdown is bundled as string constants at build time (required:
Cloudflare Workers has no filesystem). Parsed at request time by gray-matter + remark.

Frontmatter: `title`, `date`, `draft`, `tags`, `description`

**Type split:** `PostSummary` (metadata only, returned by `getAllPosts`) vs `PostDetail`
(adds `html: string`, returned by `getPost`). Prevents callers from accidentally
accessing `.html` on list results — it's a type error, not a runtime undefined.

**`getAllPosts` is synchronous** — rawFiles is eagerly loaded, gray-matter is sync,
no awaits. Only `getPost` is async (remark `.process()` returns a Promise).

### Special Pages — mdsvex

About and archives pages use mdsvex. A `.md` file holds editable prose (managed via
Sveltia CMS); embedded Svelte components handle dynamic behavior (archive listing,
contact form).

---

## About + Contact

No separate `/contact/` route. Contact form lives at the bottom of the about page,
accessible via `#contact` anchor. Nav "Contact" link → `/about/#contact`.

Form action: `src/routes/about/+page.server.ts`

Flow: validate Turnstile → send via Cloudflare Email Workers `send_email` binding.

Secrets: `TURNSTILE_SECRET_KEY`, `CONTACT_EMAIL`

---

## Search

`npx pagefind --site build` runs post-build. Generates static index in `build/_pagefind/`.
Search UI is a Svelte component wrapping the Pagefind JS API.

---

## CMS — Sveltia

Mounted at `/admin/`. Config at `static/admin/config.yml`. Two collections:

- **posts** — `src/content/posts/`, fields: title, date, draft, description, tags, body
- **pages** — about and archives prose (title + body only, not form/archive components)

Primary workflow is local editing + git push. CMS is wired in for the pattern.

---

## Deployment

Push to `main` → GitHub Actions → `npm run build` + `npx pagefind --site build`
+ `npx wrangler deploy` → live in ~2 min.

---

## What Replaced What

| Hugo | SvelteKit |
|---|---|
| `themes/PaperMod` + layout overrides | Own components, no theme |
| `build.sh` to pin Hugo version | `package.json` lockfile |
| `src/worker.js` separate Worker | SvelteKit form action in `+page.server.ts` |
| Resend + `RESEND_API_KEY` | Cloudflare Email Workers (native) |
| Page bundles (`posts/slug/index.md`) | Flat files (`src/content/posts/slug.md`) |
| lunr.js search | Pagefind |
