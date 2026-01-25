# CLAUDE.md — Hugo + Cloudflare Workers Template

> **Last Updated**: January 2026
> **Template Version**: 2.0 (Hugo + Workers with Static Assets + Resend)

---

## Using This as a Template

This repository is a production-ready template for deploying a Hugo blog to Cloudflare Workers with a working contact form. Clone it and customize for your own site.

### What's Included

| Component | Description |
|-----------|-------------|
| Hugo static site | Blog with tags, archives, about page |
| Contact form | Turnstile spam protection + email delivery |
| Cloudflare Worker | Handles contact form POST requests |
| Git deployment | Push to main = automatic deploy |
| 2026-ready setup | Uses current APIs (Resend, not MailChannels) |

### Quick Start (30-60 minutes)

**Prerequisites:**
- Node.js v20+ (`node --version` to check)
- Cloudflare account (free)
- Resend account (free, optional for testing)
- GitHub account

**Steps:**

```bash
# 1. Clone and rename
git clone https://github.com/glw907/907-life.git my-site
cd my-site
rm -rf .git
git init

# 2. Update configuration
# Edit hugo.toml: baseURL, title, author, description
# Edit wrangler.toml: name = "my-site"
# Edit content/about.md: your bio

# 3. Create GitHub repository
gh repo create my-site --public --source=. --push

# 4. Connect to Cloudflare (see "Deployment" section below)
```

### What to Customize Per-Project

| File | What to Change |
|------|----------------|
| `hugo.toml` | `baseURL`, `title`, `author`, menu items |
| `wrangler.toml` | `name` (must match Cloudflare Worker name) |
| `content/about.md` | Your bio and description |
| `content/_index.md` | Home page title |
| `layouts/_default/about.html` | Turnstile site key (line 44) |
| `static/css/styles.css` | Colors, fonts, layout |
| Footer in `layouts/partials/footer.html` | Copyright, links |

### Accounts and API Keys Needed

| Service | What You Need | Required For |
|---------|--------------|--------------|
| Cloudflare | Free account | Hosting |
| Cloudflare Turnstile | Site key + secret key | Spam protection |
| Resend | API key | Contact form email |
| GitHub | Repository | Git deployment |

**For testing only:** You can skip Resend setup initially. The form will work with Turnstile testing keys and show errors for email (which is fine for testing layout/flow).

### Important: 2024-2025 Changes

This template reflects several significant changes in the Cloudflare ecosystem:

| What Changed | When | Impact |
|-------------|------|--------|
| **Cloudflare Pages deprecated** | April 2025 | Use Workers with Static Assets instead |
| **MailChannels discontinued** | August 2024 | Use Resend for email (or similar service) |
| **Node.js v20+ required** | 2024 | Wrangler requires modern Node.js |

If you find tutorials referencing Cloudflare Pages, Pages Functions, or MailChannels, they are outdated.

---

## Project Overview

A personal blog built with Hugo and hosted on Cloudflare Workers (with Static Assets).

- **Site URL**: https://907.life
- **Hosting**: Cloudflare Workers (Static Assets)
- **Framework**: Hugo (static site generator)
- **Repository**: github.com/glw907/907-life
- **Author**: Geoffrey L. Wright

---

## Deployment (2026 Approach)

### Project Structure

```
my-site/
├── wrangler.toml      # Workers configuration (REQUIRED)
├── build.sh           # Hugo build script (REQUIRED)
├── src/
│   └── worker.js      # Contact form handler
├── hugo.toml          # Hugo configuration
├── content/           # Blog content
├── layouts/           # Hugo templates
├── static/            # CSS, images
└── public/            # Build output (gitignored)
```

### Cloudflare Workers Setup (Step-by-Step)

1. **Go to Cloudflare Dashboard**
   - Navigate to: Compute (Workers) > Workers & Pages
   - Click **Create** > **Import a repository**

2. **Connect GitHub**
   - Authorize Cloudflare if needed
   - Select your repository

3. **Configure Build**
   - **Worker name**: Must match `name` in wrangler.toml exactly
   - **Production branch**: `main`
   - Leave other fields as defaults (wrangler.toml handles build config)

4. **Deploy**
   - Click **Save and Deploy**
   - Wait 2-3 minutes
   - Site available at: `https://{worker-name}.{subdomain}.workers.dev`

5. **Add Environment Variables**
   - Go to: Worker > Settings > Variables
   - Add (see table below)
   - Click **Deploy** to apply

### Environment Variables

Set these in Cloudflare Workers dashboard after initial deploy:

| Variable | Value | Type | Purpose |
|----------|-------|------|---------|
| `TURNSTILE_SECRET_KEY` | Your secret key | Encrypted | Spam protection |
| `CONTACT_EMAIL` | `you@example.com` | Plain text | Form destination |
| `RESEND_API_KEY` | `re_xxxxxxxx` | Encrypted | Email sending |

**Alternative: Set via Wrangler CLI:**

```bash
# Requires wrangler login first
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
# For plain text variables
npx wrangler secret put CONTACT_EMAIL
```

### Custom Domain Setup

1. **Add domain to Cloudflare**
   - Cloudflare Dashboard > Add a site > your-domain.com
   - Update nameservers at your registrar

2. **Connect to Worker**
   - Worker > Settings > Domains & Routes > Add > Custom domain
   - Enter your domain
   - SSL provisioned automatically

3. **WWW redirect** (optional)
   - Rules > Redirect Rules
   - If hostname = www.your-domain.com
   - Redirect to: https://your-domain.com${http.request.uri.path}

---

## Contact Form Setup

### Architecture

```
User submits form
    |
    v
Turnstile validates (spam protection)
    |
    v
Worker validates Turnstile token
    |
    v
Worker sends email via Resend API
    |
    v
User sees success message
```

### Turnstile Setup

1. **Create Widget**
   - Cloudflare Dashboard > Turnstile > Add site
   - Add your domain(s) to allowed hostnames
   - Copy site key and secret key

2. **Update Template**
   - Edit `layouts/_default/about.html` line 44
   - Replace site key: `data-sitekey="YOUR_SITE_KEY"`

3. **Add Secret to Cloudflare**
   - Worker > Settings > Variables
   - Add `TURNSTILE_SECRET_KEY` (encrypted)

**For Testing (workers.dev domains):**

Use Cloudflare's testing keys (work on any domain):

| Key Type | Value | Notes |
|----------|-------|-------|
| Site key (always passes) | `1x00000000000000000000AA` | Use in HTML |
| Secret key (always passes) | `1x0000000000000000000000000000000AA` | Worker auto-detects |

The worker script automatically detects testing tokens and uses the appropriate secret key.

### Resend Setup

1. **Create Account**
   - Sign up at https://resend.com (free: 3,000 emails/month)

2. **Generate API Key**
   - Dashboard > API Keys > Create
   - Copy the key (starts with `re_`)

3. **Add to Cloudflare**
   - Worker > Settings > Variables
   - Add `RESEND_API_KEY` (encrypted)

**For Testing Without Domain Verification:**

The worker is pre-configured to use `onboarding@resend.dev` as the sender address. This works immediately without domain verification.

**For Production (custom sender address):**

1. Resend Dashboard > Domains > Add Domain
2. Add DNS records (SPF, DKIM, DMARC) to Cloudflare DNS
3. Wait for verification
4. Update `src/worker.js` line 170:
   ```javascript
   from: 'Contact Form <contact@your-domain.com>',
   ```

---

## Site Structure

### Navigation

| Item | URL | Notes |
|------|-----|-------|
| Home | `/` | Recent posts |
| Photos | `https://photos.907.life` | External, opens in new tab |
| Archives | `/archives/` | Posts by year + tag list |
| About | `/about/` | Bio + contact form |

### Content Organization

```
content/
├── _index.md          # Home page
├── posts/             # Blog posts (YYYY-MM-DD-slug.md)
├── archives.md        # Archives page
└── about.md           # About + contact form
```

### Taxonomy

Tags only (no categories). Common tags: `alaska`, `musings`, `technology`, `books`, `music`, `photography`

---

## Development Workflow

### Prerequisites

- Hugo installed locally (`apt install hugo` or download from https://gohugo.io)
- Node.js v20+ (for Wrangler)

### Daily Workflow

```bash
# Start local server
hugo server -D

# Preview at http://localhost:1313
# Edit content, see live reload

# When ready to publish:
# 1. Remove draft: true from front matter
# 2. Commit and push
git add -A && git commit -m "Add new post" && git push

# Cloudflare auto-deploys in ~2 minutes
```

### Creating Posts

```bash
hugo new posts/$(date +%Y-%m-%d)-my-post-slug.md
```

### Front Matter Template

```yaml
---
title: "Post Title"
date: 2026-01-25
draft: true
tags: ["tag1", "tag2"]
description: "Brief description for previews"
---
```

### Local Testing with Wrangler

```bash
# Build Hugo
hugo --gc --minify

# Run local worker (contact form works)
npx wrangler dev

# Preview at http://localhost:8787
```

---

## Commands Reference

### Hugo

| Command | Purpose |
|---------|---------|
| `hugo server -D` | Dev server with drafts |
| `hugo server` | Dev server, published only |
| `hugo new posts/...` | Create new post |
| `hugo --gc --minify` | Production build |

### Wrangler

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local dev with Worker |
| `npx wrangler deploy` | Manual deploy |
| `npx wrangler tail` | View live logs |
| `npx wrangler secret put VAR_NAME` | Set secret |
| `npx wrangler secret list` | List secrets |

---

## Troubleshooting

### Build/Deployment Issues

| Issue | Solution |
|-------|----------|
| "Worker name mismatch" | `name` in wrangler.toml must exactly match Worker name in dashboard |
| "Hugo command not found" | Verify build.sh is committed and executable |
| Build timeout | Check build.sh for errors; Hugo builds should take seconds |
| 404 on all pages | Verify `[assets] directory = "./public"` in wrangler.toml |
| Contact form 404 | Check `run_worker_first = ["/contact"]` is inside `[assets]` section |

### wrangler.toml Field Ordering (Important!)

The order of fields in wrangler.toml matters:

```toml
# CORRECT ORDER
name = "my-site"
compatibility_date = "2025-01-25"
main = "src/worker.js"           # Must be BEFORE [build]

[build]
command = "..."

[assets]
directory = "./public"
run_worker_first = ["/contact"]  # Must be INSIDE [assets]
```

### Contact Form Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Email service not configured" | Missing RESEND_API_KEY | Add to Worker variables, click Deploy |
| "Email service authentication failed" | Invalid API key | Generate new key in Resend dashboard |
| "Email domain not verified" | Using custom from address | Verify domain OR use onboarding@resend.dev |
| "Too many requests" | Hit rate limit | Wait, or upgrade Resend plan |
| Form works locally, fails in production | Missing env vars | Check Settings > Variables, click Deploy |

### Turnstile Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid domain" on workers.dev | Hostname not in Turnstile allowlist | Use testing keys (see above) |
| Widget doesn't appear | Site key wrong or JS blocked | Check browser console, verify site key |
| Validation always fails | Secret key mismatch | Verify TURNSTILE_SECRET_KEY in Worker variables |

### Node.js Issues

```bash
# Check version (must be 20+)
node --version

# If too old, use nvm:
nvm install 20
nvm use 20
```

---

## Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:1313 | Hugo dev server |
| http://localhost:8787 | Wrangler dev server |
| https://907.life | Production site |
| https://dash.cloudflare.com | Cloudflare dashboard |
| https://resend.com | Email service dashboard |

---

## Related Documentation

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers Git Integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Resend API Documentation](https://resend.com/docs/api-reference/emails/send-email)
- [Send Emails with Resend (Cloudflare Tutorial)](https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/)

---

## Implementation Notes

Implementation details and phase notes are in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

---

## Configuration Reference

### hugo.toml Key Settings

| Setting | Value |
|---------|-------|
| baseURL | `https://907.life/` |
| Pagination | 20 posts per page |
| Permalinks | `/:year/:month/:day/:slug/` |
| Taxonomies | Tags only |
| Output formats | HTML, RSS, JSON |

### wrangler.toml Structure

```toml
name = "907-life"
compatibility_date = "2025-01-25"
main = "src/worker.js"

[build]
command = "chmod +x build.sh && ./build.sh"

[assets]
directory = "./public"
binding = "ASSETS"
not_found_handling = "404-page"
run_worker_first = ["/contact"]
```

### Environment Variables Summary

| Variable | Required | Purpose |
|----------|----------|---------|
| TURNSTILE_SECRET_KEY | Yes (for form) | Spam protection |
| CONTACT_EMAIL | Yes (for form) | Where emails go |
| RESEND_API_KEY | Yes (for email) | Resend authentication |
| HUGO_VERSION | No | Override build.sh version |
