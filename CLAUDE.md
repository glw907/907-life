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

### Phase 5: Contact Form Backend (Completed 2025-01-24)

#### Files Created

**Layout:**
- `layouts/_default/about.html` - About page layout with contact form

**Cloudflare Pages Function:**
- `functions/contact.js` - Handles form submissions, validates Turnstile, sends email via Fastmail JMAP

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
- Placeholder sitekey: "YOUR_SITE_KEY_HERE" (replace in production)

#### Cloudflare Pages Function (functions/contact.js)

**Functionality:**
1. Validates all form fields are present
2. Validates Turnstile token via Cloudflare API
3. Sends email via Fastmail JMAP API
4. Returns JSON response (success or error)

**Email Format:**
- From: `geoff@907.life` (configured via CONTACT_EMAIL env var)
- To: `geoff@907.life`
- Reply-To: Sender's email (enables one-click replies)
- Subject: `[907.life] {form subject}`
- Body: Plain text with sender info and message

**Error Handling:**
- Required field validation
- Turnstile token validation
- JMAP API error handling
- Network error handling
- All errors return user-friendly JSON messages

#### Fastmail JMAP Implementation

**Two-step process:**
1. Get JMAP session from `https://api.fastmail.com/jmap/session`
2. Create email and submit via JMAP methodCalls:
   - `Email/set` - Creates draft email
   - `EmailSubmission/set` - Sends the email

**Authentication:**
- Uses Fastmail App Password (not main account password)
- Passed as Bearer token in Authorization header

#### Environment Variables Required

**Cloudflare Pages Dashboard → Settings → Environment Variables:**
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret key (encrypted)
- `FASTMAIL_API_TOKEN` - Fastmail App Password (encrypted)
- `FASTMAIL_ACCOUNT_ID` - Fastmail account ID (encrypted)
- `CONTACT_EMAIL` - Destination email: geoff@907.life (plain text)

**Documentation:** See `.env.example` for details and setup URLs

#### Setup Instructions (To Be Completed in Production)

**1. Cloudflare Turnstile Setup:**
- Go to https://dash.cloudflare.com → Turnstile
- Add site: 907.life
- Domain: 907.life
- Widget mode: Managed
- Copy Site Key → Replace "YOUR_SITE_KEY_HERE" in layouts/_default/about.html
- Copy Secret Key → Add to Cloudflare Pages environment variables

**2. Fastmail JMAP Setup:**
- Go to https://www.fastmail.com/settings/security/devicekeys
- Create App Password with JMAP access
- Note the API token
- Get Account ID from https://api.fastmail.com/jmap/session (requires authentication)
- Add both to Cloudflare Pages environment variables

**3. Cloudflare Pages Environment Variables:**
- Go to Cloudflare Pages → 907-life → Settings → Environment variables
- Add all 4 variables to Production environment
- Mark sensitive values as Encrypted

#### Tasks Completed
- ✓ About page layout created with contact form
- ✓ Turnstile widget added to form
- ✓ Turnstile script loaded from CDN
- ✓ JavaScript form handler implemented
- ✓ Form feedback UI (success/error messages)
- ✓ Cloudflare Pages Function created (functions/contact.js)
- ✓ Fastmail JMAP integration implemented
- ✓ Email formatting configured (Reply-To, subject prefix)
- ✓ Error handling for all failure scenarios
- ✓ .env.example created with documentation
- ✓ content/about.md updated to use about layout
- ✓ Site builds successfully
- ✓ Form renders correctly in HTML

#### Notes
- Form structure is complete and ready to use
- Actual functionality requires Turnstile keys and Fastmail credentials
- Site key in about.html is placeholder - must be replaced before deployment
- Environment variables must be set in Cloudflare Pages dashboard
- Form uses POST to /contact (handled by Pages Function)
- JavaScript is inline in template (no external file needed)
- No build step or dependencies required
- Ready for Phase 6 (deployment and configuration)
