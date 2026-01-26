# Hugo + Cloudflare Workers Implementation Plan

> **Last Updated**: January 2026
> **Status**: Complete (907.life deployed)

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

## Template Usage

This implementation plan documents how 907.life was built and serves as a guide for future projects using this template.

### One-Time vs Per-Project Tasks

| Phase | One-Time Setup | Per-Project |
|-------|----------------|-------------|
| Phase 1 | Node.js, Wrangler, Hugo, Cloudflare account | New repo, wrangler login |
| Phase 2 | - | hugo.toml customization |
| Phase 3 | - | Theme customization |
| Phase 4 | - | Content creation |
| Phase 5 | Resend account | Turnstile widget, API keys via wrangler |
| Phase 6 | DNS nameservers | wrangler deploy, domain setup |
| Phase 7-9 | - | Workflow, testing, content |

### What Changed in 2024-2025

This plan reflects the current (January 2026) Cloudflare ecosystem:

| Change | Date | Old Approach | New Approach |
|--------|------|--------------|--------------|
| Pages deprecated | April 2025 | Cloudflare Pages | Workers with Static Assets |
| MailChannels discontinued | August 2024 | MailChannels API | Resend API |
| Node.js requirement | 2024 | Any Node.js | Node.js v20+ for Wrangler |

**If you find tutorials using Pages, Pages Functions, or MailChannels, they are outdated.**

### Prerequisites Checklist

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
# If using template
git clone https://github.com/glw907/907-life.git my-site
cd my-site
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"

# Create GitHub repo
gh repo create my-site --public --source=. --push
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
| **2.1 Initialize Hugo Site** | `hugo new site . --force` (skip if using template) |
| **2.2 Configure hugo.toml** | Base URL, title, author, pagination, permalinks, menu |
| **2.3 Create Directory Structure** | content/, static/, src/ |
| **2.4 Create .gitignore** | Exclude build artifacts, secrets |
| **2.5 Update CLAUDE.md** | Document config decisions |

### 2.2 hugo.toml Configuration

Key settings to customize per-project:

```toml
baseURL = "https://your-domain.com/"
title = "Your Site Name"

[params]
  author = "Your Name"
  description = "Your site description"
  email = "you@example.com"

# Menu customization
[menu]
  [[menu.main]]
    name = "Home"
    url = "/"
    weight = 1
  # Add more menu items...
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
- [ ] hugo.toml configured with your settings
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
| **3.2 Customize Navigation** | Update menu items in hugo.toml |
| **3.3 Customize Footer** | Update copyright, links |
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

### Completion Checklist

- [ ] All layouts rendering correctly
- [ ] CSS customized to your preferences
- [ ] Navigation shows your menu items
- [ ] Footer shows your copyright and links
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
tags: ["tag1", "tag2"]
description: "Brief description"
---

Your content here...
```

### Completion Checklist

- [ ] Home page displays posts
- [ ] Archives page shows posts by year
- [ ] About page with your bio
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

### 5.3 Turnstile Setup

1. Cloudflare Dashboard > Turnstile > Add site
2. Site name: Your site name
3. Domain: Your domain (and workers.dev for testing)
4. Widget mode: **Managed**
5. Copy Site Key and Secret Key

**Testing Keys** (work on any domain):

| Type | Key |
|------|-----|
| Site key (always passes) | `1x00000000000000000000AA` |
| Secret key (always passes) | `1x0000000000000000000000000000000AA` |

The worker script automatically detects testing tokens and uses appropriate keys.

### 5.4 Update About Template

Edit `layouts/_default/about.html`, find the Turnstile div (around line 44):

```html
<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY_HERE"></div>
```

Replace with your site key or testing key.

### 5.5 Configure Secrets via Wrangler

**This is the recommended approach.** Provide your API keys to Claude Code, which will configure them:

```bash
# Set Turnstile secret key
wrangler secret put TURNSTILE_SECRET_KEY
# Enter value when prompted: (your Turnstile secret key)

# Set Resend API key
wrangler secret put RESEND_API_KEY
# Enter value when prompted: re_xxxxxxxx

# Set contact email
wrangler secret put CONTACT_EMAIL
# Enter value when prompted: you@example.com

# Verify secrets are configured
wrangler secret list
```

**Local Development:** For local testing with `wrangler dev`, create a `.env` file:

```bash
# .env (gitignored - safe to store locally)
TURNSTILE_SECRET_KEY=your_secret_key_here
RESEND_API_KEY=re_xxxxxxxx
CONTACT_EMAIL=you@example.com
```

**Dashboard Alternative:** Worker > Settings > Variables > Add each variable (then click Deploy)

### Completion Checklist

- [ ] Resend account created
- [ ] API key generated
- [ ] Turnstile widget created
- [ ] Site key added to about.html
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
| **6.5 Verify Deployment** | Check workers.dev URL |
| **6.6 Set Up Git Integration** | Enable auto-deploy on push |
| **6.7 Add Custom Domain** | Connect your domain |
| **6.8 Test Production** | Full end-to-end test |
| **6.9 Update CLAUDE.md** | Document deployment |

### 6.1 wrangler.toml Configuration

**Critical**: Field order matters!

```toml
# Top-level fields FIRST
name = "your-site-name"
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

### 6.4 Deploy via Wrangler (Recommended)

```bash
# Verify you're authenticated
wrangler whoami

# Build and deploy
wrangler deploy

# Output shows deployment URL:
# Published your-site-name (x.xx sec)
# https://your-site-name.your-subdomain.workers.dev
```

**Verify Secrets (if set in Phase 5):**

```bash
wrangler secret list
# Should show: TURNSTILE_SECRET_KEY, RESEND_API_KEY, CONTACT_EMAIL
```

**If secrets not yet configured:**

```bash
wrangler secret put TURNSTILE_SECRET_KEY
wrangler secret put RESEND_API_KEY
wrangler secret put CONTACT_EMAIL
```

### 6.6 Set Up Git Integration (Auto-Deploy)

For automatic deployments when you `git push`, connect your GitHub repository:

1. **Dashboard Navigation**
   - Cloudflare Dashboard > Compute (Workers) > Workers & Pages
   - Click **Create** > **Import a repository**

2. **Connect GitHub**
   - Authorize Cloudflare if needed
   - Select your repository

3. **Configure Build**
   - **Worker name**: MUST match `name` in wrangler.toml exactly
   - **Production branch**: `main`
   - Leave other fields as defaults (wrangler.toml handles build config)

4. **Save**
   - Click **Save and Deploy**
   - Future `git push` commands trigger automatic deploys

**Note:** This is the only step that requires the dashboard. All other configuration can be done via Wrangler CLI.

### 6.7 Custom Domain Setup

**Via Wrangler CLI:**

```bash
# Add custom domain route
wrangler deploy --route your-domain.com/*

# Or add to wrangler.toml for persistence:
# [[routes]]
# pattern = "your-domain.com/*"
# zone_name = "your-domain.com"
```

**Domain Prerequisites:**

1. **Add domain to Cloudflare** (if not already)
   - Dashboard > Add a site > your-domain.com
   - Update nameservers at registrar
   - Wait for activation

2. **Connect to Worker** (Dashboard Alternative)
   - Workers & Pages > Your Worker > Settings > Domains & Routes
   - Add > Custom domain
   - Enter your domain
   - SSL provisions automatically

3. **WWW Redirect** (optional)
   - Rules > Redirect Rules
   - Create rule: www.your-domain.com > https://your-domain.com${http.request.uri.path}

### Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| "Worker name mismatch" | `name` in wrangler.toml must exactly match dashboard |
| "Hugo command not found" | Verify build.sh is committed and executable |
| Build fails with npm errors | Check Node.js version (v20+ required) |
| 404 on all pages | Check `[assets] directory = "./public"` |
| Contact form 404 | Check `run_worker_first` is inside `[assets]` section |
| Env vars not working | Run `wrangler secret list` to verify, redeploy if needed |

**Viewing Logs via Wrangler:**

```bash
# Stream live logs
wrangler tail

# With filters
wrangler tail --status error
```

**Dashboard Alternative:** Workers & Pages > Your Worker > Deployments > View logs

### Completion Checklist

- [ ] wrangler.toml verified (field order correct)
- [ ] `wrangler deploy` successful
- [ ] Site loads at workers.dev URL
- [ ] `wrangler secret list` shows all secrets
- [ ] Git integration configured (for auto-deploy)
- [ ] Custom domain connected (if applicable)
- [ ] SSL working
- [ ] Contact form working
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
# Edit in your editor

# 3. Preview at http://localhost:1313

# 4. When ready, remove draft: true

# 5. Publish
git add -A
git commit -m "Add new post"
git push

# 6. Verify at your domain (~2 min deploy)
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

**Production Site:**
- [ ] Home page loads
- [ ] All navigation links work
- [ ] Archives page displays correctly
- [ ] Tag pages work
- [ ] About page renders
- [ ] Contact form visible

**Contact Form:**
- [ ] Turnstile widget appears
- [ ] Form validation works
- [ ] Submission succeeds
- [ ] Email received
- [ ] Reply-to works correctly

**SSL/HTTPS:**
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to apex (if configured)

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
| **9.1 About Page** | Write real bio |
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

## Quick Reference

### Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:1313 | Hugo dev server |
| http://localhost:8787 | Wrangler dev server |
| https://your-domain.com | Production site |
| https://dash.cloudflare.com | Cloudflare dashboard (optional) |
| https://resend.com | Email service |

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

# Git (triggers auto-deploy if git integration enabled)
git add -A && git commit -m "..." && git push
```

### Environment Variables

| Variable | Required | Type | Purpose |
|----------|----------|------|---------|
| TURNSTILE_SECRET_KEY | Yes | Encrypted | Spam protection |
| CONTACT_EMAIL | Yes | Plain text | Email destination |
| RESEND_API_KEY | Yes | Encrypted | Email sending |
| HUGO_VERSION | No | Plain text | Override build version |

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
