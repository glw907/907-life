# CLAUDE.md — 907.life Hugo Project

## Project Overview

A personal blog built with Hugo and hosted on Cloudflare Workers (with Static Assets). Topics include Alaska adventures, philosophical musings, technology, books, music, photography, and whatever else comes to mind.

- **Site URL**: https://907.life
- **Hosting**: Cloudflare Workers (Static Assets)
- **Framework**: Hugo (static site generator)
- **Repository**: github.com/glw907/907-life
- **Author**: Geoffrey L. Wright

**Note**: As of April 2025, Cloudflare deprecated Pages in favor of Workers with Static Assets. This project uses the new Workers-based deployment approach.

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
| Worker Script | `src/worker.js` handles POST to `/contact` |
| MailChannels | Sends email via API (free for Cloudflare Workers) |

### Form Flow

1. User fills form on About page
2. Turnstile validates human
3. Form POSTs to `/contact`
4. Worker script validates Turnstile token
5. Worker sends email via MailChannels API
6. User sees success/error message (inline, no reload)

### Email Format

| Field | Value |
|-------|-------|
| From | `907.life Contact Form <noreply@907.life>` |
| Reply-To | Sender's email (one click to reply) |
| To | `geoff@907.life` |
| Subject | `[907.life] {form subject}` |
| Body | Plain text with sender info and message |

### Environment Variables

Set in Cloudflare Workers dashboard (Settings → Variables):

| Variable | Purpose |
|----------|---------|
| `TURNSTILE_SECRET_KEY` | Turnstile validation (encrypted) |
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

### Wrangler

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local dev server with Worker |
| `npx wrangler deploy` | Deploy to Cloudflare Workers |
| `npx wrangler tail` | View real-time logs |

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
| http://localhost:1313 | Hugo dev server |
| http://localhost:8787 | Wrangler dev server (with Worker) |
| https://907.life | Production site |
| https://907-life.{account}.workers.dev | Cloudflare Workers URL |
| https://dash.cloudflare.com | Cloudflare dashboard |
| https://github.com/glw907/907-life | GitHub repo |

## Important Notes

1. **Theme is custom** — layouts in `layouts/`, not a submodule
2. **Plain CSS** — no SASS/build step, edit `static/css/styles.css` directly
3. **Photos link is external** — not a local page, opens photos.907.life in new tab
4. **Worker script** — lives in `src/worker.js`, handles contact form POST
5. **wrangler.toml** — configures build, static assets, and Worker
6. **Environment variables** — secrets in Cloudflare dashboard, never in git
7. **Drafts** — use `draft: true` while working, remove to publish
8. **Tags are organic** — just use new tags in front matter as needed

## Troubleshooting

### Hugo server won't start
- Check for syntax errors in templates
- Run `hugo` alone to see detailed errors

### Changes not appearing on live site
- Confirm `draft: true` is removed
- Check Cloudflare Workers dashboard → Deployments for build status
- Build typically takes 1-2 minutes

### Contact form not working
- Verify environment variables in Cloudflare Workers dashboard → Settings → Variables
- Check Worker logs: `npx wrangler tail` or dashboard → Logs
- Ensure Turnstile site key matches domain

### Turnstile "Invalid domain" error

This error appears when the Turnstile widget is loaded on a domain not configured in the widget's hostname list.

**Root cause**: Each Turnstile widget has a list of allowed hostnames. Production keys only work on those specific domains.

**Solution for testing/staging (workers.dev domains)**:

Use Cloudflare's official **testing keys** which work on ANY domain:

| Type | Key | Behavior |
|------|-----|----------|
| Site key (visible, always passes) | `1x00000000000000000000AA` | Works on any domain |
| Site key (visible, always fails) | `2x00000000000000000000AB` | For testing error states |
| Site key (invisible, always passes) | `1x00000000000000000000BB` | Invisible widget |
| Site key (forces challenge) | `3x00000000000000000000FF` | Interactive challenge |
| Secret key (always passes) | `1x0000000000000000000000000000000AA` | Validates test tokens |
| Secret key (always fails) | `2x0000000000000000000000000000000AA` | For testing failures |

**Current implementation**:

The worker (`src/worker.js`) auto-detects testing tokens (contain `DUMMY`) and uses the appropriate secret key:
- Testing tokens: Uses testing secret key `1x0000000000000000000000000000000AA`
- Production tokens: Uses `env.TURNSTILE_SECRET_KEY`

**To switch between testing and production**:

1. Edit `/layouts/_default/about.html` line 44
2. Testing: `data-sitekey="1x00000000000000000000AA"`
3. Production: `data-sitekey="0x4AAAAAACPc3bf8bl6ifC3c"`

**Note**: Testing keys generate dummy tokens (`XXXX.DUMMY.TOKEN.XXXX`) that only work with testing secret keys. The worker handles this automatically.

**For production deployment on 907.life**:
1. Switch site key back to production key
2. Ensure `TURNSTILE_SECRET_KEY` env var is set in Cloudflare dashboard
3. Ensure `907.life` is in the Turnstile widget's hostname list

**Important**: Hostname changes in Turnstile may have propagation delays. If you add a hostname and it doesn't work immediately, wait a few minutes and clear browser cache.

### CSS not updating
- Hard refresh browser (`Ctrl+Shift+R`)
- Check file is saved

## Cloudflare Workers Deployment (2026)

This section documents the current (January 2026) process for deploying a Hugo site to Cloudflare Workers with Git integration.

### Project Structure for Workers

```
907-life/
├── wrangler.toml      # Workers configuration (required)
├── build.sh           # Build script for Hugo (required for version control)
├── src/
│   └── worker.js      # Worker script (handles contact form)
├── content/           # Hugo content
├── layouts/           # Hugo layouts
├── static/            # Static assets
└── public/            # Build output (generated, gitignored)
```

### Key Configuration Files

**wrangler.toml** - Defines the Worker name, build command, and static assets:

```toml
name = "907-life"
compatibility_date = "2025-01-25"

[build]
command = "chmod +x build.sh && ./build.sh"

[assets]
directory = "./public"
binding = "ASSETS"
not_found_handling = "404-page"

run_worker_first = ["/contact"]

main = "src/worker.js"
```

**build.sh** - Downloads and installs specific Hugo version:

```bash
#!/usr/bin/env bash
set -euo pipefail
HUGO_VERSION="${HUGO_VERSION:-0.123.7}"
# Downloads Hugo, extracts, and runs hugo --gc --minify
```

### Git Integration Setup (Step-by-Step)

**Important**: The Worker name in the dashboard must match the `name` in wrangler.toml or the build will fail.

1. **Navigate to Workers & Pages**
   - Cloudflare Dashboard → Compute (Workers) → Workers & Pages

2. **Import Repository**
   - Click **Create** (or **Create application**)
   - Select **Import a repository** under "Get started"
   - Connect your GitHub account if not already connected
   - Select the repository: `glw907/907-life`

3. **Configure Build Settings**

   The dashboard shows a simplified configuration screen. Most settings are auto-detected from wrangler.toml:

   | Field | Value | Notes |
   |-------|-------|-------|
   | Worker name | `907-life` | Must match `name` in wrangler.toml |
   | Production branch | `main` | Branch that triggers production deploys |
   | Root directory | `/` | Leave as default (or specify for monorepos) |

   **Note**: You will NOT see a "Build output directory" field. This is configured in wrangler.toml under `[assets] directory = "./public"`.

4. **Click Save and Deploy**
   - Cloudflare clones the repo
   - Runs the build command from wrangler.toml (`./build.sh`)
   - Uploads static assets from `public/`
   - Deploys the Worker

5. **Initial Deployment**
   - Wait 2-3 minutes for first build
   - Worker available at: `https://907-life.{subdomain}.workers.dev`
   - Check **Deployments** tab for build logs

### Environment Variables

After initial deployment, add environment variables:

1. Go to **Workers & Pages** → **907-life** → **Settings** → **Variables**
2. Add variables:

   | Variable | Value | Type |
   |----------|-------|------|
   | `TURNSTILE_SECRET_KEY` | (your secret key) | Encrypted |
   | `CONTACT_EMAIL` | `geoff@907.life` | Plain text |

3. Click **Deploy** to apply changes

**Note**: `HUGO_VERSION` can optionally be set as a Build Variable to override the version in build.sh.

### Custom Domain Setup

1. **Add Domain to Cloudflare**
   - Cloudflare Dashboard → Add a site → `907.life`
   - Update nameservers at your registrar to Cloudflare's

2. **Connect Domain to Worker**
   - Workers & Pages → 907-life → Settings → Domains & Routes
   - Click **Add** → **Custom domain**
   - Enter: `907.life`
   - SSL certificate provisions automatically

3. **Configure www Redirect**
   - Cloudflare Dashboard → Rules → Redirect Rules
   - Create rule: `www.907.life` → `https://907.life${http.request.uri.path}` (301)

### Automatic Deployments

Once connected, every push to `main` triggers:
1. Cloudflare receives webhook from GitHub
2. Clones repository and runs build.sh
3. Hugo builds site to `public/`
4. Static assets uploaded to Cloudflare's CDN
5. Worker deployed globally

Build time: ~2-3 minutes

### Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| "Worker name mismatch" | Ensure `name` in wrangler.toml matches Worker name in dashboard |
| "Hugo command not found" | Check build.sh is executable and HUGO_VERSION is valid |
| Build timeout | Hugo builds should complete in seconds; check for infinite loops |
| 404 on all pages | Verify `[assets] directory = "./public"` and Hugo outputs to public/ |
| Contact form 404 | Check `run_worker_first = ["/contact"]` in wrangler.toml |
| Environment variables not working | Add to Settings → Variables, then click Deploy |

### Alternative: CLI Deployment

For manual deployment without Git integration:

```bash
# Install wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build Hugo locally
hugo --gc --minify

# Deploy
wrangler deploy
```

## Related Documentation

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers Git Integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [Cloudflare Workers Builds Configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)

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

### Phase 3: Theme Migration (Completed 2025-01-24)

#### Theme Files Migrated
- Cloned archived repository (907-life-archive) temporarily to /tmp
- Copied layouts, static files, and archetypes
- Cleaned up temporary clone

#### Templates Created/Updated

**Layouts:**
- `layouts/_default/baseof.html` - Base HTML structure (migrated)
- `layouts/_default/single.html` - Updated to show tags instead of categories
- `layouts/_default/list.html` - List pages with pagination (migrated)
- `layouts/_default/archives.html` - NEW: Posts by year + tag list
- `layouts/_default/taxonomy.html` - NEW: Tags list page
- `layouts/_default/term.html` - NEW: Individual tag pages
- `layouts/_default/index.json` - JSON feed output (migrated)
- `layouts/index.html` - Simplified to show all posts (removed old filtering logic)

**Partials:**
- `layouts/partials/head.html` - Head section with meta tags, CSS, feeds (migrated)
- `layouts/partials/header.html` - Site header with logo (migrated)
- `layouts/partials/navigation.html` - UPDATED: New menu from hugo.toml with external Photos link support
- `layouts/partials/footer.html` - UPDATED: New footer with Contact, GitHub, RSS links
- `layouts/partials/post-date.html` - Date display helper (kept from archive)

**Archetypes:**
- `archetypes/posts.md` - NEW: YAML front matter template for posts
- `archetypes/default.md` - Default TOML template (from Hugo init)

**Static Assets:**
- `static/css/styles.css` - 11KB CSS file (migrated from archive)

#### Changes from Archived Theme
- Removed old section-specific layouts (guides/, reviews/, also/)
- Removed archive-intro.html partial (not needed)
- Removed list.archivehtml.html (replaced with archives.html)
- Updated navigation to use hugo.toml menu configuration
- Updated footer with new link structure
- Simplified index.html to show all posts (removed "also" tag filtering)
- Changed single.html from categories to tags
- Created new archives, taxonomy, and term layouts

#### Navigation Menu
- Home: `/`
- Photos: `https://photos.907.life` (external, opens in new tab with ↗)
- Archives: `/archives/`
- About: `/about/`

#### Footer Links
- © 2025 Geoffrey L. Wright
- Contact: `/about/#contact` (anchor to form)
- GitHub: `https://github.com/glw907` (external, opens in new tab with ↗)
- RSS: `/feed.xml`

#### Tasks Completed
- ✓ Theme files fetched from archived repo
- ✓ Base templates adapted for new structure
- ✓ Navigation updated with menu configuration
- ✓ Partials updated (header, footer, navigation)
- ✓ Archives layout created (posts by year + tag list)
- ✓ Tag templates created (taxonomy.html, term.html)
- ✓ Footer updated with new links
- ✓ Hugo builds successfully with zero errors
- ✓ Old section layouts cleaned up

#### Notes
- Hugo builds cleanly with no errors or warnings
- All templates use semantic HTML and microformats (h-entry, p-name, etc.)
- External links properly marked with target="_blank" rel="noopener" and ↗
- Font Awesome 6.4.0 CDN used for icons
- CSS is plain CSS with no build step required
- Theme is custom and lives in layouts/, not a submodule

### Phase 4: Content Pages (Completed 2025-01-24)

#### Content Files Created

**Static Pages:**
- `content/_index.md` - Home page (displays recent posts via index.html template)
- `content/archives.md` - Archives page with layout: "archives"
- `content/about.md` - About page with bio and #contact anchor

**Sample Blog Posts (5 posts across dates and tags):**
1. `content/posts/2025-01-23-testing-the-new-site.md` - Tags: technology
2. `content/posts/2025-01-10-winter-prior-lake.md` - Tags: alaska, photography
3. `content/posts/2024-12-15-book-notes-example.md` - Tags: books
4. `content/posts/2024-12-01-favorite-albums-2024.md` - Tags: music
5. `content/posts/2024-11-20-quick-thoughts.md` - Tags: musings

#### About Page Content
- Real bio content (not placeholder)
- Description of blog topics
- #contact anchor for contact form link in footer
- Placeholder text for contact form (to be implemented in Phase 5)

#### Post Archetype
- Already created in Phase 3: `archetypes/posts.md`
- YAML front matter with title, date, draft, tags, description

#### Generated Site Structure
- Homepage: Displays all 5 posts with excerpts
- Archives page: Posts grouped by year (2024, 2025) + tag list
- About page: Bio with #contact anchor working
- Individual post pages: All rendering correctly with tags
- Tag pages: 6 tags generated (alaska, books, music, musings, photography, technology)
- Feeds: RSS (feed.xml) and JSON (feed.json) generated
- Sitemap: sitemap.xml generated

#### Build Statistics
- Total pages: 27 (up from 6)
- Non-page files: 0
- Static files: 1 (styles.css)
- Aliases: 8
- Build time: 39ms

#### Tasks Completed
- ✓ Home page created (content/_index.md)
- ✓ Archives page created with correct layout
- ✓ About page created with bio and #contact anchor
- ✓ Post archetype already in place (from Phase 3)
- ✓ 5 sample posts created across multiple tags and dates
- ✓ All posts set to draft: false (published)
- ✓ Site builds successfully
- ✓ All pages render correctly
- ✓ Tag pages generate automatically
- ✓ RSS and JSON feeds working
- ✓ #contact anchor verified in about page HTML

#### Notes
- No errors or warnings during build
- All permalinks follow configured pattern: /year/month/day/slug/
- Sample posts include variety of content (some with <!--more--> tags for excerpts)
- One post demonstrates multi-tag usage (alaska + photography)
- Footer "Contact" link correctly points to /about/#contact
- Archives page displays both posts by year AND tag list as designed
- Ready for Phase 5 (contact form backend implementation)

### Phase 5: Contact Form Backend (Completed 2025-01-24, Updated 2025-01-25)

**Important Update (2025-01-25):** Cloudflare deprecated Pages in April 2025. The contact form must now use Cloudflare Workers with Static Assets instead of Pages Functions. The architecture has been updated accordingly.

#### Files Created/Updated

**Layout:**
- `layouts/_default/about.html` - About page layout with contact form

**Worker Script (NEW - replaces Pages Function):**
- `src/worker.js` - Handles POST to `/contact`, validates Turnstile, sends email via MailChannels

**Configuration (NEW):**
- `wrangler.toml` - Cloudflare Workers configuration with static assets

**Legacy (to be removed):**
- `functions/contact.js` - OLD Pages Function format (superseded by `src/worker.js`)

**Environment Configuration:**
- `.env.example` - Documents required environment variables (never commit actual .env)

**Updated Content:**
- `content/about.md` - Updated to use "about" layout, removed placeholder text

#### Contact Form Features

**HTML Form:**
- Fields: Name, Email, Subject, Message (all required)
- Cloudflare Turnstile widget for spam protection
- Submit button with loading state
- Status message area for feedback

**JavaScript Handler:**
- Async form submission (no page reload)
- Disables submit button during submission
- Shows loading state ("Sending...")
- Displays success/error messages inline
- Resets form on success
- Resets Turnstile widget after submission
- Handles network errors gracefully

**Turnstile Integration:**
- Widget embedded in form with data-sitekey attribute
- Script loaded from Cloudflare CDN (async, defer)
- Token automatically included in form submission
- Site key: `0x4AAAAAACPc3bf8bl6ifC3c` (configured)

#### Worker Script (src/worker.js)

**Functionality:**
1. Serves static assets from Hugo's `public/` directory
2. Intercepts POST requests to `/contact`
3. Validates all form fields
4. Validates Turnstile token via Cloudflare API
5. Sends email via MailChannels API
6. Returns JSON response (success or error)

**Email Format:**
- From: `907.life Contact Form <noreply@907.life>` (via MailChannels)
- To: `geoff@907.life` (configured via CONTACT_EMAIL env var)
- Reply-To: Sender's email (enables one-click replies)
- Subject: `[907.life] {form subject}`
- Body: Plain text with sender info and message

**Error Handling:**
- Required field validation
- Turnstile token validation
- MailChannels API error handling
- Network error handling
- All errors return user-friendly JSON messages

#### MailChannels Email Implementation

**Why MailChannels:**
- Free email sending service for Cloudflare Workers
- No additional credentials needed
- Reliable delivery with proper email headers
- Simpler than SMTP (which Cloudflare Workers can't use directly)

**How it works:**
1. Worker validates form and Turnstile
2. Sends email via MailChannels API (`https://api.mailchannels.net/tx/v1/send`)
3. MailChannels delivers email to geoff@907.life
4. Reply-To header allows direct responses to sender

#### Environment Variables Required

**Cloudflare Workers Dashboard → Settings → Variables:**
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret key (encrypted)
- `CONTACT_EMAIL` - Destination email: geoff@907.life (plain text)

**Documentation:** See `.env.example` for details

#### Credentials Configured

**Turnstile:**
- Site Key: `0x4AAAAAACPc3bf8bl6ifC3c` (in about.html)
- Secret Key: `0x4AAAAAACPc3X9Ux49F7FaTgulwsatcOZA` (set in Cloudflare dashboard)

**Email:**
- Destination: `geoff@907.life`
- Service: MailChannels (free, no credentials needed)

#### Tasks Completed
- ✓ About page layout created with contact form
- ✓ Turnstile widget added to form
- ✓ Turnstile script loaded from CDN
- ✓ JavaScript form handler implemented
- ✓ Form feedback UI (success/error messages)
- ✓ Worker script created (src/worker.js)
- ✓ wrangler.toml configuration created
- ✓ MailChannels integration implemented
- ✓ Email formatting configured (Reply-To, subject prefix)
- ✓ Error handling for all failure scenarios
- ✓ .env.example created with documentation
- ✓ content/about.md updated to use about layout
- ✓ Site builds successfully
- ✓ Form renders correctly in HTML

#### Notes
- Form structure is complete and ready to use
- Worker script handles both static assets AND contact form POST
- Environment variables must be set in Cloudflare Workers dashboard
- Form uses POST to /contact (handled by Worker script)
- JavaScript is inline in template (no external file needed)
- Ready for Phase 6 (deployment and configuration)
