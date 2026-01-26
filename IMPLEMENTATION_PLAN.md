# 907.life Implementation Plan

> **Last Updated**: January 2026
> **Status**: Complete (907.life deployed)
> **Project**: 907.life - Personal blog for Geoffrey L. Wright

A phased approach to building a Hugo blog hosted on Cloudflare Workers with Static Assets.

---

## Environment Assumptions

**This plan assumes a secure development environment** where:
- API keys and secrets can be safely provided to Claude Code during setup
- Secrets are stored in `.env` files for local development (gitignored by default)
- Claude Code will configure production secrets via Wrangler CLI commands
- The Wrangler CLI is the primary tool for deployment and configuration (dashboard is optional)

This approach maximizes automation and makes the setup process scriptable and reproducible.

---

## Project Information

| Field | Value |
|-------|-------|
| Site URL | https://907.life |
| Workers.dev URL | https://907-life.glw907.workers.dev |
| Repository | github.com/glw907/907-life |
| Author | Geoffrey L. Wright |
| Email | geoff@907.life |
| Worker Name | 907-life |

---

## What Changed in 2024-2025

This plan reflects the current (January 2026) Cloudflare ecosystem:

| Change | Date | Old Approach | New Approach |
|--------|------|--------------|--------------|
| Pages deprecated | April 2025 | Cloudflare Pages | Workers with Static Assets |
| MailChannels discontinued | August 2024 | MailChannels API | Resend API |
| Node.js requirement | 2024 | Any Node.js | Node.js v20+ for Wrangler |

**If you find tutorials using Pages, Pages Functions, or MailChannels, they are outdated.**

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js v20+ installed (`node --version`)
- [ ] Wrangler CLI installed and authenticated (`wrangler whoami`)
- [ ] Hugo installed (`hugo version`)
- [ ] Cloudflare account (free tier is fine)
- [ ] GitHub account
- [ ] Resend account (free tier, optional for initial testing)

---

## Working Principles

### CLAUDE.md Maintenance
**Each phase ends with a review and update of CLAUDE.md** to document:
- Actual versions installed
- Decisions made during implementation
- Issues encountered and solutions
- Any deviations from this plan

### Troubleshooting Approach
- Search the web early when troubleshooting (after 1-2 failed attempts)
- Include your OS in searches (e.g., "Ubuntu 24.04")
- Don't exhaust all local options first

### Sudo Usage
- Use `sudo -A` for privileged commands
- Always ask permission before running sudo commands

---

## Phase 1: Environment Setup

**Goal**: Prepare the local development environment with all CLI tools authenticated and ready.

### Tasks

| Task | Details | One-Time? |
|------|---------|-----------|
| **1.1 Install Node.js v20+** | Required for Wrangler CLI | Yes |
| **1.2 Install Wrangler CLI** | `npm install -g wrangler` | Yes |
| **1.3 Authenticate Wrangler** | `wrangler login` | Yes |
| **1.4 Install Hugo** | `sudo -A apt install hugo` | Yes |
| **1.5 Create Cloudflare Account** | Sign up at https://dash.cloudflare.com | Yes |
| **1.6 Initialize Repository** | Set up git, push to GitHub | Per-project |
| **1.7 Update CLAUDE.md** | Document versions, any issues | Per-project |

### 1.1 Install Node.js v20+

```bash
node --version  # Check current version

# If too old or not installed, use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20  # Set as default

node --version  # Verify: v20.0.0 or higher
```

**Why v20+?** Wrangler (Cloudflare's CLI) requires Node.js 20 or later. Older versions will fail with cryptic errors.

### 1.2 Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Verify installation
wrangler --version
```

### 1.3 Authenticate Wrangler

```bash
# Login to Cloudflare (opens browser for OAuth)
wrangler login

# Verify authentication
wrangler whoami
# Should show: Getting User settings... You are logged in with an OAuth Token...
```

**Why authenticate now?** Wrangler is used throughout this project for:
- Deploying the site (`wrangler deploy`)
- Setting secrets (`wrangler secret put`)
- Viewing logs (`wrangler tail`)
- Local development (`wrangler dev`)

Having it authenticated from the start enables CLI-first automation.

### 1.4 Install Hugo

```bash
# Ubuntu/Debian
sudo -A apt update
sudo -A apt install hugo
hugo version  # Should be 0.123.7 or similar

# Or download latest from https://gohugo.io/installation/
```

### 1.5 Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Create free account
3. Verify email
4. Note: Domain and Worker configuration comes in Phase 6

### 1.6 Initialize Repository

```bash
# Create new repository for 907-life
mkdir 907-life && cd 907-life
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo
gh repo create 907-life --public --source=. --push
```

### Completion Checklist

- [ ] `node --version` returns v20.0.0+
- [ ] `wrangler --version` returns version info
- [ ] `wrangler whoami` shows authenticated user
- [ ] `hugo version` returns 0.123.7+
- [ ] Cloudflare account created
- [ ] Git repository initialized and pushed to GitHub
- [ ] CLAUDE.md updated with Phase 1 specifics

---

## Phase 2: Hugo Project Foundation

**Goal**: Initialize Hugo and establish basic project structure.

### Tasks

| Task | Details |
|------|---------|
| **2.1 Initialize Hugo Site** | `hugo new site . --force` |
| **2.2 Configure hugo.toml** | Base URL, title, author, pagination, permalinks, menu |
| **2.3 Create Directory Structure** | content/, static/, src/ |
| **2.4 Create .gitignore** | Exclude build artifacts, secrets |
| **2.5 Update CLAUDE.md** | Document config decisions |

### 2.2 hugo.toml Configuration (907.life)

```toml
baseURL = "https://907.life/"
title = "907.life"

[params]
  author = "Geoffrey L. Wright"
  description = "Alaska adventures, philosophical musings, technology, books, music, photography"
  email = "geoff@907.life"

# Menu
[menu]
  [[menu.main]]
    name = "Home"
    url = "/"
    weight = 1
  [[menu.main]]
    name = "Photos"
    url = "https://photos.907.life"
    weight = 2
    [menu.main.params]
      external = true
  [[menu.main]]
    name = "Archives"
    url = "/archives/"
    weight = 3
  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 4
```

See the full `hugo.toml` in the repository for all settings.

### 2.4 .gitignore

Essential entries:

```
# Hugo build output
public/
resources/
.hugo_build.lock

# Environment and secrets
.env
.env.local

# Node
node_modules/
```

### Completion Checklist

- [ ] `hugo server` runs without errors
- [ ] hugo.toml configured for 907.life
- [ ] Directory structure in place
- [ ] .gitignore created
- [ ] Pushed to GitHub
- [ ] CLAUDE.md updated

---

## Phase 3: Theme Migration/Customization

**Goal**: Set up the visual design and layouts.

### Tasks

| Task | Details |
|------|---------|
| **3.1 Review Layouts** | Understand baseof.html, list.html, single.html |
| **3.2 Customize Navigation** | Home, Photos (external), Archives, About |
| **3.3 Customize Footer** | Copyright (Geoffrey L. Wright), Contact, GitHub, RSS |
| **3.4 Customize CSS** | Edit static/css/styles.css |
| **3.5 Test Theme** | Verify all pages render correctly |
| **3.6 Update CLAUDE.md** | Document customizations |

### Layout Files

```
layouts/
├── _default/
│   ├── baseof.html      # Base HTML wrapper
│   ├── list.html        # List pages (home, archives)
│   ├── single.html      # Individual posts
│   ├── about.html       # About page with contact form
│   ├── archives.html    # Archives layout
│   ├── taxonomy.html    # Tag list page
│   └── term.html        # Individual tag page
├── partials/
│   ├── head.html        # <head> contents
│   ├── header.html      # Site header
│   ├── navigation.html  # Navigation menu
│   └── footer.html      # Footer
└── index.html           # Home page
```

### 907.life Navigation

| Item | URL | Notes |
|------|-----|-------|
| Home | `/` | Recent posts |
| Photos | `https://photos.907.life` | External link |
| Archives | `/archives/` | Posts by year + tag list |
| About | `/about/` | Bio + contact form |

### 907.life Footer

| Link | URL |
|------|-----|
| Contact | `/about/#contact` |
| GitHub | `https://github.com/glw907` |
| RSS | `/feed.xml` |

### Completion Checklist

- [ ] All layouts rendering correctly
- [ ] CSS customized
- [ ] Navigation shows 907.life menu items
- [ ] Footer shows copyright and links
- [ ] CLAUDE.md updated

---

## Phase 4: Content Pages

**Goal**: Create the static pages and content structure.

### Tasks

| Task | Details |
|------|---------|
| **4.1 Home Page** | content/_index.md |
| **4.2 Archives Page** | content/archives.md |
| **4.3 About Page** | content/about.md with bio |
| **4.4 Sample Posts** | Create test posts |
| **4.5 Update CLAUDE.md** | Document content structure |

### Creating Posts

```bash
# Create new post with today's date
hugo new posts/$(date +%Y-%m-%d)-my-post-slug.md
```

### Front Matter Template

```yaml
---
title: "Post Title"
date: 2026-01-25
draft: true
tags: ["alaska", "photography"]
description: "Brief description"
---

Your content here...
```

### 907.life Tags

Common tags: `alaska`, `musings`, `technology`, `books`, `music`, `photography`

### Completion Checklist

- [ ] Home page displays posts
- [ ] Archives page shows posts by year
- [ ] About page with Geoffrey's bio
- [ ] Test posts created
- [ ] CLAUDE.md updated

---

## Phase 5: Contact Form Backend

**Goal**: Implement spam-protected contact form with email delivery.

**Important**: This phase uses Resend for email delivery. MailChannels was discontinued in August 2024.

### Tasks

| Task | Details | One-Time? |
|------|---------|-----------|
| **5.1 Create Resend Account** | Sign up at https://resend.com | Yes |
| **5.2 Generate API Key** | Dashboard > API Keys > Create | Per-project |
| **5.3 Set Up Turnstile Widget** | Cloudflare Dashboard > Turnstile | Per-project |
| **5.4 Update About Template** | Add Turnstile site key | Per-project |
| **5.5 Configure Secrets via Wrangler** | `wrangler secret put` commands | Per-project |
| **5.6 Update CLAUDE.md** | Document form setup | Per-project |

### 5.1-5.2 Resend Setup

1. **Create Account**: https://resend.com (free: 3,000 emails/month)
2. **Generate API Key**: Dashboard > API Keys > Create
3. **Copy Key**: Starts with `re_`

**Domain Verification (Optional for Testing)**:

For testing, use `onboarding@resend.dev` as the sender (pre-configured in worker.js).

For production with custom sender address:
1. Resend Dashboard > Domains > Add Domain
2. Add DNS records to Cloudflare DNS:
   - SPF record (TXT)
   - DKIM records (CNAME or TXT)
   - DMARC record (TXT, optional)
3. Wait for verification
4. Update `src/worker.js` to use your domain

### 5.3 Turnstile Setup (907.life)

1. Cloudflare Dashboard > Turnstile > Add site
2. Site name: 907.life Contact Form
3. Domains: 907.life, www.907.life, 907-life.glw907.workers.dev
4. Widget mode: **Managed**
5. Copy Site Key and Secret Key

**907.life Turnstile Keys:**
- Site key: `0x4AAAAAACPc3bf8bl6ifC3c`
- Secret key: (stored as TURNSTILE_SECRET_KEY)

**Testing Keys** (work on any domain):

| Type | Key |
|------|-----|
| Site key (always passes) | `1x00000000000000000000AA` |
| Secret key (always passes) | `1x0000000000000000000000000000000AA` |

The worker script automatically detects testing tokens and uses appropriate keys.

### 5.4 Update About Template

Edit `layouts/_default/about.html`, find the Turnstile div (around line 45):

```html
<div class="cf-turnstile" data-sitekey="0x4AAAAAACPc3bf8bl6ifC3c"></div>
```

For testing on workers.dev, use:
```html
<div class="cf-turnstile" data-sitekey="1x00000000000000000000AA"></div>
```

### 5.5 Configure Secrets via Wrangler (907.life)

```bash
# Set Turnstile secret key
wrangler secret put TURNSTILE_SECRET_KEY
# Enter value when prompted

# Set Resend API key
wrangler secret put RESEND_API_KEY
# Enter value when prompted: re_xxxxxxxx

# Set contact email
wrangler secret put CONTACT_EMAIL
# Enter value when prompted: geoff@907.life

# Verify secrets are configured
wrangler secret list
```

**Local Development:** For local testing with `wrangler dev`, create a `.env` file:

```bash
# .env (gitignored - safe to store locally)
TURNSTILE_SECRET_KEY=your_secret_key_here
RESEND_API_KEY=re_xxxxxxxx
CONTACT_EMAIL=geoff@907.life
```

### Completion Checklist

- [ ] Resend account created
- [ ] API key generated
- [ ] Turnstile widget created for 907.life
- [ ] Site key `0x4AAAAAACPc3bf8bl6ifC3c` added to about.html
- [ ] Secrets configured via `wrangler secret put`
- [ ] `wrangler secret list` shows all three secrets
- [ ] CLAUDE.md updated

---

## Phase 6: Cloudflare Workers Deployment

**Goal**: Deploy site to Cloudflare Workers with Static Assets.

**Updated January 2026**: This phase uses the current Workers Git integration. Cloudflare Pages was deprecated in April 2025.

### Tasks

| Task | Details |
|------|---------|
| **6.1 Review wrangler.toml** | Verify configuration |
| **6.2 Review build.sh** | Verify Hugo version |
| **6.3 Review Worker Script** | Verify src/worker.js |
| **6.4 Deploy via Wrangler** | `wrangler deploy` |
| **6.5 Verify Deployment** | Check https://907-life.glw907.workers.dev |
| **6.6 Set Up Git Integration** | Enable auto-deploy on push |
| **6.7 Add Custom Domain** | Connect 907.life |
| **6.8 Test Production** | Full end-to-end test |
| **6.9 Update CLAUDE.md** | Document deployment |

### 6.1 wrangler.toml Configuration (907.life)

**Critical**: Field order matters!

```toml
# Top-level fields FIRST
name = "907-life"
compatibility_date = "2025-01-25"
main = "src/worker.js"           # MUST be before [build]

# Build section
[build]
command = "chmod +x build.sh && ./build.sh"

# Assets section
[assets]
directory = "./public"
binding = "ASSETS"
not_found_handling = "404-page"
run_worker_first = ["/contact"]  # MUST be inside [assets]
```

**Common Mistakes**:
- `main` after `[build]` = Worker won't load
- `run_worker_first` outside `[assets]` = Contact form 404

### 6.4 Deploy via Wrangler

```bash
# Verify you're authenticated
wrangler whoami

# Build and deploy
wrangler deploy

# Output shows deployment URL:
# Published 907-life (x.xx sec)
# https://907-life.glw907.workers.dev
```

**Verify Secrets:**

```bash
wrangler secret list
# Should show: TURNSTILE_SECRET_KEY, RESEND_API_KEY, CONTACT_EMAIL
```

### 6.6 Set Up Git Integration (Auto-Deploy)

For automatic deployments when you `git push`:

1. **Dashboard Navigation**
   - Cloudflare Dashboard > Compute (Workers) > Workers & Pages
   - Click **Create** > **Import a repository**

2. **Connect GitHub**
   - Authorize Cloudflare if needed
   - Select repository: 907-life

3. **Configure Build**
   - **Worker name**: `907-life` (MUST match wrangler.toml exactly)
   - **Production branch**: `main`
   - Leave other fields as defaults

4. **Save**
   - Click **Save and Deploy**
   - Future `git push` commands trigger automatic deploys

**Note:** This is the only step that requires the dashboard.

### 6.7 Custom Domain Setup (907.life)

**Prerequisites:**
1. 907.life domain added to Cloudflare
2. Nameservers updated at registrar
3. Domain activated in Cloudflare

**Connect to Worker:**
1. Workers & Pages > 907-life > Settings > Domains & Routes
2. Add > Custom domain
3. Enter: 907.life
4. SSL provisions automatically

**WWW Redirect:**
- Rules > Redirect Rules
- Create rule: www.907.life > https://907.life${http.request.uri.path}

### Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| "Worker name mismatch" | `name` in wrangler.toml must be `907-life` |
| "Hugo command not found" | Verify build.sh is committed and executable |
| Build fails with npm errors | Check Node.js version (v20+ required) |
| 404 on all pages | Check `[assets] directory = "./public"` |
| Contact form 404 | Check `run_worker_first` is inside `[assets]` section |
| Env vars not working | Run `wrangler secret list` to verify |

**Viewing Logs:**

```bash
# Stream live logs
wrangler tail

# With filters
wrangler tail --status error
```

### Completion Checklist

- [ ] wrangler.toml verified (name = "907-life")
- [ ] `wrangler deploy` successful
- [ ] Site loads at https://907-life.glw907.workers.dev
- [ ] `wrangler secret list` shows all secrets
- [ ] Git integration configured
- [ ] Custom domain 907.life connected
- [ ] SSL working
- [ ] Contact form sends to geoff@907.life
- [ ] CLAUDE.md updated

---

## Phase 7: Development Workflow

**Goal**: Establish smooth edit > preview > publish workflow.

### Tasks

| Task | Details |
|------|---------|
| **7.1 VSCodium/VSCode Settings** | .vscode/settings.json |
| **7.2 VSCodium/VSCode Tasks** | .vscode/tasks.json |
| **7.3 Shell Aliases** | Optional shortcuts |
| **7.4 Test Full Workflow** | Create > preview > publish |
| **7.5 Update CLAUDE.md** | Document workflow |

### Daily Workflow

```bash
# 1. Start dev server
hugo server -D

# 2. Create/edit content
hugo new posts/$(date +%Y-%m-%d)-my-post.md
# Edit in VSCodium

# 3. Preview at http://localhost:1313

# 4. When ready, remove draft: true

# 5. Publish
git add -A
git commit -m "Add new post"
git push

# 6. Verify at https://907.life (~2 min deploy)
```

### Local Testing with Worker

To test the contact form locally:

```bash
# Build Hugo
hugo --gc --minify

# Run wrangler dev
npx wrangler dev

# Test at http://localhost:8787
```

### Completion Checklist

- [ ] Dev server workflow smooth
- [ ] Can create new posts easily
- [ ] Live reload working
- [ ] Deploy workflow tested
- [ ] CLAUDE.md updated

---

## Phase 8: Final Testing

**Goal**: Verify everything works end-to-end.

### Test Checklist

**Local Development:**
- [ ] `hugo server -D` starts correctly
- [ ] Live reload works
- [ ] New post creation works

**Production Site (https://907.life):**
- [ ] Home page loads
- [ ] All navigation links work
- [ ] Photos link opens https://photos.907.life
- [ ] Archives page displays correctly
- [ ] Tag pages work
- [ ] About page renders
- [ ] Contact form visible

**Contact Form:**
- [ ] Turnstile widget appears
- [ ] Form validation works
- [ ] Submission succeeds
- [ ] Email received at geoff@907.life
- [ ] Reply-to works correctly

**SSL/HTTPS:**
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS
- [ ] www.907.life redirects to 907.life

**Feeds:**
- [ ] /feed.xml is valid RSS
- [ ] /feed.json is valid JSON

### Completion Checklist

- [ ] All tests passing
- [ ] Issues fixed and deployed
- [ ] CLAUDE.md accurate and complete

---

## Phase 9: Content Creation

**Goal**: Replace sample content with real content.

### Tasks

| Task | Details |
|------|---------|
| **9.1 About Page** | Write real bio for Geoffrey |
| **9.2 Remove Sample Posts** | Delete or convert to drafts |
| **9.3 First Real Post** | Create and publish |
| **9.4 Verify Live Site** | Confirm real content displays |
| **9.5 Final CLAUDE.md Review** | Ensure docs reflect final state |

### Completion Checklist

- [ ] About page has real content
- [ ] Sample posts removed
- [ ] At least one real post published
- [ ] Live site displays real content
- [ ] CLAUDE.md finalized
- [ ] Ready for ongoing blogging!

---

## Phase 10: Create Template Versions

**Goal**: Create generic template versions of the documentation for future Hugo + Cloudflare Workers projects.

**Note**: This phase is completed once for the 907.life project. When using this repository as a template for a new project, you'll use the template files as your starting point and customize the placeholders.

### Tasks

| Task | Details |
|------|---------|
| **10.1 Create CLAUDE-TEMPLATE.md** | Generic version with placeholders |
| **10.2 Create IMPLEMENTATION-PLAN-TEMPLATE.md** | Generic implementation guide |
| **10.3 Verify Templates** | Ensure all project-specific values are replaced |

### Placeholder Mapping

| 907.life Value | Template Placeholder |
|----------------|---------------------|
| 907.life | {PROJECT_NAME} |
| 907-life | {PROJECT_SLUG} |
| glw907 | {GITHUB_USERNAME} |
| Geoffrey L. Wright | {AUTHOR_NAME} |
| geoff@907.life | {CONTACT_EMAIL} |
| https://907.life | https://{PROJECT_NAME} |
| https://907-life.glw907.workers.dev | https://{PROJECT_SLUG}.{GITHUB_USERNAME}.workers.dev |
| https://photos.907.life | {PHOTOS_URL} (or remove if not applicable) |
| https://github.com/glw907 | https://github.com/{GITHUB_USERNAME} |
| 0x4AAAAAACPc3bf8bl6ifC3c | {TURNSTILE_SITE_KEY} |

### Template Header

Each template file should include this header:

```markdown
# TEMPLATE USAGE INSTRUCTIONS

This is a template file. To use it for a new project:

1. Copy this file to CLAUDE.md (or IMPLEMENTATION_PLAN.md)
2. Replace all placeholders with your project-specific values:
   - {PROJECT_NAME} - Your site name (e.g., mysite.com)
   - {PROJECT_SLUG} - URL-safe version (e.g., mysite)
   - {GITHUB_USERNAME} - Your GitHub username
   - {AUTHOR_NAME} - Your name
   - {CONTACT_EMAIL} - Your email address
   - {TURNSTILE_SITE_KEY} - Your Turnstile site key (or use testing key)
3. Remove this instructions section
4. Update any project-specific navigation, links, or descriptions

---
```

### What to Genericize

**CLAUDE-TEMPLATE.md:**
- Project Overview section (all URLs, names, emails)
- Navigation items (Photos link is 907.life-specific)
- Footer links
- Turnstile configuration
- Environment variable examples
- wrangler.toml examples
- Key URLs table

**IMPLEMENTATION-PLAN-TEMPLATE.md:**
- Project Information table
- hugo.toml examples
- Turnstile keys
- wrangler.toml examples
- Repository commands
- Domain setup examples

### Completion Checklist

- [ ] CLAUDE-TEMPLATE.md created with all placeholders
- [ ] IMPLEMENTATION-PLAN-TEMPLATE.md created with all placeholders
- [ ] Templates include usage instructions header
- [ ] No 907.life-specific values remain in templates
- [ ] Templates committed to repository
- [ ] CLAUDE.md documents template files exist

---

## Quick Reference

### Key URLs (907.life)

| URL | Purpose |
|-----|---------|
| http://localhost:1313 | Hugo dev server |
| http://localhost:8787 | Wrangler dev server |
| https://907.life | Production site |
| https://907-life.glw907.workers.dev | Workers.dev URL |
| https://photos.907.life | Photos site |
| https://dash.cloudflare.com | Cloudflare dashboard |
| https://resend.com | Email service |
| https://github.com/glw907/907-life | GitHub repository |

### Common Commands

```bash
# Wrangler (primary deployment tool)
wrangler login          # Authenticate with Cloudflare
wrangler whoami         # Verify authentication
wrangler deploy         # Build and deploy
wrangler dev            # Local development server
wrangler tail           # Stream live logs
wrangler secret put X   # Set secret X
wrangler secret list    # List all secrets
wrangler secret delete X # Remove secret X

# Hugo
hugo server -D          # Dev server with drafts
hugo --gc --minify      # Production build
hugo new posts/...      # Create post

# Git (triggers auto-deploy)
git add -A && git commit -m "..." && git push
```

### Environment Variables (907.life)

| Variable | Value/Purpose |
|----------|---------------|
| TURNSTILE_SECRET_KEY | Spam protection (encrypted) |
| CONTACT_EMAIL | geoff@907.life |
| RESEND_API_KEY | Resend authentication (encrypted) |
| HUGO_VERSION | Optional: override build version |

---

## Lessons Learned

Documented during the 907.life implementation:

### CLI-First Workflow

Using Wrangler CLI from the start provides significant benefits:
- **Automation**: Commands can be scripted and reproduced
- **Speed**: No need to navigate dashboard UI
- **Version control**: wrangler.toml captures configuration
- **Claude Code integration**: Claude can configure secrets via CLI commands

The dashboard is only required for one-time Git integration setup.

### wrangler.toml Gotchas

1. **Field order matters**: `main` must be before `[build]` section
2. **run_worker_first placement**: Must be inside `[assets]` section, not at top level
3. **Name matching**: Worker name in dashboard must exactly match `name` in wrangler.toml

### Turnstile on workers.dev

Turnstile widgets only work on domains in their allowlist. For workers.dev testing:
- Use Cloudflare's testing site key: `1x00000000000000000000AA`
- Worker auto-detects testing tokens and uses testing secret key

### Resend vs MailChannels

MailChannels discontinued free Cloudflare Workers integration on August 31, 2024. Resend is the recommended replacement:
- Free tier: 3,000 emails/month (100/day)
- For testing: Use `onboarding@resend.dev` as sender (no domain verification needed)
- For production: Verify your domain in Resend dashboard

### Node.js Version

Wrangler requires Node.js v20+. Check with `node --version` before troubleshooting other issues.

### Secrets via Wrangler vs Dashboard

Using `wrangler secret put` is preferred over dashboard:
- Secrets take effect immediately (no manual "Deploy" click needed)
- Can be scripted: `echo "value" | wrangler secret put NAME`
- Verify with `wrangler secret list`

If using dashboard: remember to click **Deploy** after adding/changing variables.
