# 907.life Hugo Site

Personal blog built with Hugo + PaperMod theme, deployed to Cloudflare Workers.

---

## Quick Reference

| Task | Primary Doc | Section |
|------|-------------|---------|
| Understand design decisions | `docs/architecture.md` | (whole file) |
| Run local dev | `docs/operations.md` | Development |
| Deploy changes | `docs/operations.md` | Deployment |
| Fix contact form | `docs/operations.md` | Contact Form Configuration |
| Troubleshoot issues | `docs/operations.md` | Troubleshooting |

---

## Critical Constraints

### Theme: PaperMod

This site uses the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme as a git submodule at `themes/PaperMod/`.

**CSS override rules:**
- CSS variable definitions: `themes/PaperMod/assets/css/core/theme-vars.css`
- All overrides go in: `assets/css/extended/custom.css` (auto-included by PaperMod)
- Never edit files inside `themes/` — only override via `layouts/` and `assets/css/extended/`
- Dark mode selector: `:root[data-theme="dark"]` (not `.dark`)

**Layout override rules:**
- Override a PaperMod layout by copying it to the same path under `layouts/`
- Three overrides currently maintained: `layouts/_default/single.html`, `layouts/_default/archives.html`, `layouts/_default/about.html`
- When PaperMod is updated, spot-check COUPLING MANIFEST in `assets/css/extended/custom.css`

### Hugo Version

**Minimum required:** Hugo 0.146.0 (enforced by PaperMod's baseof.html)
**Build script uses:** 0.147.0 (set in `build.sh` as `HUGO_VERSION`)

### Contact Form Requires Worker

The contact form won't work in Hugo's dev server (`hugo server`). To test:

```bash
# Build site
./build.sh

# Run worker locally
npx wrangler dev

# Test at http://localhost:8787/about
```

**Rationale:** Form handler runs in Cloudflare Worker, not Hugo's dev server.

### Secrets Must Be Configured

The worker requires three secrets:
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`

**Check secrets:**
```bash
npx wrangler secret list
```

**Set a secret:**
```bash
npx wrangler secret put SECRET_NAME
```

### Build Script Ensures Correct Hugo Version

Always use `./build.sh` to build the site (not `hugo` directly).

---

## Common Operations

### Development

```bash
# Start dev server (uses local .bin/hugo if already built once)
.bin/hugo server -D

# Or build first, then serve
./build.sh && .bin/hugo server -D

# Site at http://localhost:1313
# Note: Contact form won't work (needs worker)
```

### Add a New Post

```bash
# Create post bundle
.bin/hugo new posts/2026-02-04-post-title/index.md

# Edit content
# Set draft: false when ready
# Add tags: ["tag1", "tag2"]
```

**Post Structure:**
```
posts/
  2026-02-04-post-title/
    index.md
    image.jpg (optional)
```

### Deploy

```bash
# Automatic: Push to GitHub main
git add path/to/files
git commit -m "Description"
git push origin main

# Manual (if needed)
./build.sh
npx wrangler deploy
```

### Update Contact Form Email

```bash
npx wrangler secret put CONTACT_EMAIL
# Enter: geoff@907.life (or new email)
```

---

## Project Structure

```
907-life/
├── content/
│   ├── _index.md          # Homepage
│   ├── about.md           # About page (layout: about → contact form)
│   ├── archives.md        # Archives page (layout: archives)
│   ├── search.md          # Search page (layout: search)
│   └── posts/             # Blog posts (page bundles)
├── layouts/
│   └── _default/
│       ├── about.html     # About page with contact form
│       ├── archives.html  # Year-grouped posts + tag list
│       └── single.html    # Single post with IndieWeb microformats
├── assets/
│   └── css/
│       └── extended/
│           └── custom.css # All CSS overrides (PaperMod extension point)
├── themes/
│   └── PaperMod/          # Theme submodule (never edit directly)
├── static/
│   └── images/            # Site images
├── src/
│   └── worker.js          # Contact form handler (unchanged by theme migration)
├── docs/
│   ├── architecture.md    # Design decisions
│   └── operations.md      # Dev, deploy, troubleshooting
├── hugo.toml              # Hugo configuration (theme + PaperMod params)
├── wrangler.toml          # Worker configuration
└── build.sh               # Build script (downloads Hugo 0.147.0)
```

---

## PaperMod Configuration

Key params in `hugo.toml` under `[params]`:

| Param | Value | Effect |
|-------|-------|--------|
| `defaultTheme` | `"auto"` | Respects OS preference |
| `ShowThemeToggle` | `true` | Light/dark toggle in header |
| `ShowToc` | `true` | Table of contents on posts |
| `TocOpen` | `false` | TOC collapsed by default |
| `ShowReadingTime` | `false` | Disabled |
| `ShowShareButtons` | `false` | Disabled |
| `ShowPostNavLinks` | `true` | Prev/next links on posts |

No `socialIcons` are configured — social media links are intentionally absent.

---

## IndieWeb Microformats

The custom `layouts/_default/single.html` adds microformat classes:
- `article.h-entry` — entry wrapper
- `h1.p-name` — post title
- `div.e-content` — post body
- `a.u-url` — permalink (hidden machine-readable)
- `span.p-author` — author (hidden machine-readable)
- `time.dt-published` — publish date (hidden machine-readable)

---

## Worker Configuration

**File:** `src/worker.js`

**Routes:**
- `POST /contact` → Worker handles form submission
- Everything else → Static assets from Hugo

**Configuration:** `wrangler.toml`
```toml
run_worker_first = ["/contact"]

[assets]
directory = "./public"
binding = "ASSETS"
```

---

## Contact Form Flow

1. User fills out form on `/about/`
2. JavaScript submits form data + Turnstile token
3. Worker validates Turnstile token with Cloudflare API
4. Worker sends email via Resend API
5. Worker returns JSON success/error response
6. JavaScript displays message to user

**Turnstile site key (public):** `0x4AAAAAACPc3bf8bl6ifC3c`

**Secrets Required:**
- `TURNSTILE_SECRET_KEY` - Validates spam protection
- `RESEND_API_KEY` - Sends email
- `CONTACT_EMAIL` - Destination (geoff@907.life)

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Build fails with Hugo version error | Check `build.sh` HUGO_VERSION ≥ 0.146.0 |
| Contact form not working | Check secrets: `npx wrangler secret list` |
| Form shows "invalid token" | Turnstile key mismatch |
| Email not arriving | Check Resend logs, verify domain DNS |
| CSS not updating | Hard refresh (Ctrl+Shift+R) or wait for CDN cache |
| Build errors | Run `.bin/hugo --verbose` for details |
| Theme layout changed after update | Check COUPLING MANIFEST in `assets/css/extended/custom.css` |

---

## Deployment Info

**Production Site:** https://907.life
**Repository:** https://github.com/glw907/907-life

**Deployment Flow:**
1. Push to GitHub main
2. GitHub Actions runs `build.sh`
3. Deploys via Wrangler
4. Live in ~2 minutes

**Cloudflare Account:** Account ID `120c269ad6d3dfbe6d63a0bb53758ca0`

**GitHub Actions:** https://github.com/glw907/907-life/actions

---

## Cross-Site Admin

For DNS records, domain verification, or service configuration:

```bash
cd ~/Projects/cloudflare-sites
claude
```

**Site config:** `~/Projects/cloudflare-sites/sites/907.life.yaml`

**Services:**
- Cloudflare (DNS, Workers, Turnstile)
- GitHub (repository, Actions)
- Resend (transactional email)
- Fastmail (email hosting)

---

## External Links

- **Repository:** https://github.com/glw907/907-life
- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **PaperMod Theme:** https://github.com/adityatelange/hugo-PaperMod
- **Turnstile Dashboard:** https://dash.cloudflare.com/?to=/:account/turnstile
- **Resend Dashboard:** https://resend.com/
- **Hugo Docs:** https://gohugo.io/documentation/
- **Workers Docs:** https://developers.cloudflare.com/workers/
