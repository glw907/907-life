# CLAUDE.md — 907.life Hugo Project

## Project Overview

A personal blog built with Hugo and hosted on Cloudflare Pages. Topics include Alaska adventures, philosophical musings, technology, books, music, photography, and whatever else comes to mind.

- **Site URL**: https://907.life
- **Hosting**: Cloudflare Pages
- **Framework**: Hugo (static site generator)
- **Repository**: github.com/glw907/907-life
- **Author**: Geoffrey L. Wright

## Site Structure

### Navigation

| Item | URL | Notes |
|------|-----|-------|
| Home | `/` | Recent posts |
| Photos | `https://photos.907.life` | External ↗, opens in new tab |
| Archives | `/archives/` | Posts by year + tag list |
| About | `/about/` | Bio + contact form |

### Footer

```
© 2025 Geoffrey L. Wright · Contact · GitHub ↗ · RSS
```

| Link | URL |
|------|-----|
| Contact | `/about/#contact` (anchor to form) |
| GitHub | `https://github.com/glw907` (external, new tab) |
| RSS | `/feed.xml` |

### Content Organization

```
content/
├── _index.md          # Home page (recent posts, no intro text)
├── posts/             # Blog posts
│   └── YYYY-MM-DD-slug.md
├── archives.md        # Archives page (by year + tags)
└── about.md           # About + contact form
```

### Taxonomy

**Tags only** (no categories). Tags are organic and multi-tag posts are encouraged.

Common tags: `alaska`, `musings`, `technology`, `books`, `music`, `photography`

New tags can be added anytime — just use them in front matter.

### Theme Structure

Custom theme (not a submodule). Plain CSS, no build step.

```
layouts/
├── _default/
│   ├── baseof.html      # Base wrapper
│   ├── list.html        # List pages
│   ├── single.html      # Individual posts
│   ├── taxonomy.html    # Tag list page (/tags/)
│   └── term.html        # Individual tag page (/tags/{tag}/)
├── partials/
│   ├── head.html        # <head> contents
│   ├── header.html      # Site header
│   ├── navigation.html  # Nav with external Photos link (↗)
│   └── footer.html      # Footer with Contact, GitHub, RSS
├── index.html           # Home page template
└── _default/archives.html  # Archives layout

static/
└── css/
    └── styles.css       # All styles (plain CSS)
```

## Development Workflow

### Quick Reference

| Action | How |
|--------|-----|
| Open project | `codium ~/Projects/907-life` |
| Start dev server | VSCodium: Run Task → "Hugo: Start Server" |
| Create new post | Run Task → "New Post" → enter slug |
| Preview | Browser: `http://localhost:1313` |
| Publish | `Ctrl+Alt+P` or Run Task → "Publish" |
| Quick publish | Run Task → "Quick Publish" (default commit message) |

### Daily Workflow

1. **Open project** in VSCodium
2. **Start server**: Run Task → "Hugo: Start Server"
3. **Create/edit** content in `content/posts/`
4. **Preview** at localhost:1313 (live reload)
5. **When ready**: Remove `draft: true` from front matter
6. **Publish**: `Ctrl+Alt+P` → enter commit message
7. **Verify**: Check https://907.life (~1-2 min deploy)

### Creating Content

```bash
# Via VSCodium task (recommended)
Run Task → "New Post" → enter slug (e.g., "winter-prior-lake")
# Creates: content/posts/2025-01-23-winter-prior-lake.md

# Or via terminal
hugo new posts/$(date +%Y-%m-%d)-my-post-slug.md
```

### Front Matter Template

```yaml
---
title: "Post Title"
date: 2025-01-23
draft: true
tags: ["alaska", "photography"]
description: "Brief description for previews and SEO"
---
```

### Shell Aliases

Available in terminal (defined in `~/.bashrc`):

| Alias | What it does |
|-------|--------------|
| `blog` | Opens project in VSCodium + starts dev server |
| `newpost` | Start creating a post (finish with slug + `.md`) |
| `blogpush` | Quick publish from terminal |

## Hugo Configuration

Key settings in `hugo.toml`:

| Setting | Value |
|---------|-------|
| baseURL | `https://907.life/` |
| Pagination | 20 posts per page |
| Permalinks | `/year/month/day/slug/` for posts |
| Taxonomies | Tags only |
| Output formats | HTML, RSS, JSON |

## Contact Form

### Architecture

| Component | Purpose |
|-----------|---------|
| Cloudflare Turnstile | Spam protection (managed mode) |
| Pages Function | `functions/contact.js` handles POST |
| Fastmail JMAP | Sends email via API |

### Form Flow

1. User fills form on About page
2. Turnstile validates human
3. Form POSTs to `/contact`
4. Pages Function validates Turnstile token
5. Function sends email via Fastmail JMAP
6. User sees success/error message (inline, no reload)

### Email Format

| Field | Value |
|-------|-------|
| From | `907.life Contact <geoff@907.life>` |
| Reply-To | Sender's email (one click to reply) |
| To | `geoff@907.life` |
| Subject | `[907.life] {form subject}` |
| Body | Plain text with sender info and message |

### Environment Variables

Set in Cloudflare Pages dashboard (Production):

| Variable | Purpose |
|----------|---------|
| `TURNSTILE_SECRET_KEY` | Turnstile validation |
| `FASTMAIL_API_TOKEN` | Fastmail App Password |
| `FASTMAIL_ACCOUNT_ID` | Fastmail account |
| `CONTACT_EMAIL` | Destination (`geoff@907.life`) |

**Never commit secrets to git.** Use `.env.example` to document required vars.

## Commands Reference

### Hugo

| Command | Purpose |
|---------|---------|
| `hugo server -D` | Dev server with drafts |
| `hugo server` | Dev server, published only |
| `hugo new posts/...` | Create new post |
| `hugo` | Build site to `public/` |

### Git

| Command | Purpose |
|---------|---------|
| `git add <files>` | Stage changes |
| `git commit -m "..."` | Commit locally |
| `git push` | Push → triggers Cloudflare deploy |

### Wrangler (optional)

| Command | Purpose |
|---------|---------|
| `npx wrangler pages dev ./public` | Test Pages Functions locally |

## File Naming Conventions

### Blog Posts

- Format: `YYYY-MM-DD-slug-with-hyphens.md`
- Example: `2025-01-23-winter-prior-lake.md`
- Slug: lowercase, hyphens, descriptive

### Images

- Store in: `static/images/`
- Reference as: `/images/filename.jpg`

## Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:1313 | Local dev server |
| https://907.life | Production site |
| https://907-life.pages.dev | Cloudflare Pages URL |
| https://dash.cloudflare.com | Cloudflare dashboard |
| https://github.com/glw907/907-life | GitHub repo |

## Important Notes

1. **Theme is custom** — layouts in `layouts/`, not a submodule
2. **Plain CSS** — no SASS/build step, edit `static/css/styles.css` directly
3. **Photos link is external** — not a local page, opens photos.907.life in new tab
4. **Pages Functions** — live in `/functions/` at project root
5. **Environment variables** — secrets in Cloudflare dashboard, never in git
6. **Drafts** — use `draft: true` while working, remove to publish
7. **Tags are organic** — just use new tags in front matter as needed

## Troubleshooting

### Hugo server won't start
- Check for syntax errors in templates
- Run `hugo` alone to see detailed errors

### Changes not appearing on live site
- Confirm `draft: true` is removed
- Check Cloudflare Pages dashboard for build status
- Build typically takes 1-2 minutes

### Contact form not working
- Verify environment variables in Cloudflare dashboard
- Check Pages Function logs in Cloudflare
- Ensure Turnstile site key matches domain

### CSS not updating
- Hard refresh browser (`Ctrl+Shift+R`)
- Check file is saved

## Related Documentation

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Fastmail JMAP API](https://www.fastmail.com/developer/)

---

## Implementation Notes

### Phase 1: Environment Setup (Completed 2025-01-24)

#### Hugo Installation
- **Version**: v0.123.7+extended linux/amd64 (Ubuntu ESM package)
- **Installation method**: `apt install hugo`
- **Build info**: BuildDate=2025-07-18T03:45:53Z VendorInfo=ubuntu:0.123.7-1ubuntu0.3+esm1

#### Repository Setup
- Old repository renamed to `907-life-archive` on GitHub
- New repository created at `github.com/glw907/907-life`
- Initial commit includes: CLAUDE.md, IMPLEMENTATION_PLAN.md, GETTING_STARTED.md
- Branch: main (renamed from default master)

#### Environment
- OS: Ubuntu 24.04 (Noble)
- Platform: Linux 6.14.0-37-generic
- VSCodium: User's preferred editor (extensions to be installed manually)

#### Tasks Completed
- ✓ Hugo installed via apt
- ✓ Old repository archived
- ✓ New git repository initialized
- ✓ Initial commit and push to GitHub
- ⏳ Cloudflare account setup (manual task for user)
- ⏳ VSCodium extensions installation (manual task for user)
- ⏳ VSCodium workspace configuration (deferred to Phase 7)

#### Notes
- No issues encountered during installation
- Hugo extended version includes SCSS/SASS support (not needed for this project but available)
- The `hugo` package pulled in golang and gcc as dependencies (expected for extended version)

### Phase 2: Hugo Project Foundation (Completed 2025-01-24)

#### Hugo Site Initialization
- Initialized Hugo site with `hugo new site . --force`
- Default directories created: archetypes/, assets/, content/, data/, i18n/, layouts/, static/, themes/

#### Configuration
- **hugo.toml** configured with:
  - Base URL: https://907.life/
  - Title: 907.life
  - Author: Geoffrey L. Wright
  - Pagination: 20 posts per page
  - Permalinks: `/:year/:month/:day/:slug/` for posts
  - Taxonomies: Tags only (no categories)
  - Menu: Home, Photos (external), Archives, About
  - Output formats: HTML, RSS (as feed.xml), JSON (as feed.json)
  - Privacy: All third-party tracking disabled
  - Markup: Goldmark with unsafe HTML enabled, Monokai syntax highlighting

#### Directory Structure Created
```
content/posts/          # Blog posts
static/css/             # Stylesheets
static/images/          # Image assets
functions/              # Cloudflare Pages Functions
layouts/_default/       # Default layouts
layouts/partials/       # Partial templates
```

#### .gitignore
- Excludes: public/, resources/, .hugo_build.lock
- Excludes: .env files, node_modules/
- Excludes: OS files (.DS_Store, Thumbs.db)
- Excludes: Editor temp files

#### Tasks Completed
- ✓ Hugo site initialized
- ✓ hugo.toml fully configured
- ✓ Directory structure created
- ✓ .gitignore created
- ✓ Hugo builds successfully (empty site, warnings about missing layouts expected)

#### Notes
- Configuration validated with `hugo` build command
- No errors encountered
- Layout warnings are expected and will be resolved in Phase 3
- Site ready for theme migration
