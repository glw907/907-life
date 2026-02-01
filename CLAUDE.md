# CLAUDE.md — 907.life Hugo Project

> **Last Updated**: January 2026
> **Project**: 907.life (Production deployment)

---

## Project Overview

A personal blog built with Hugo and hosted on Cloudflare Workers (with Static Assets). Topics include Alaska adventures, philosophical musings, technology, books, music, photography, and whatever else comes to mind.

- **Site URL**: https://907.life
- **Workers.dev URL**: https://907-life.glw907.workers.dev
- **Hosting**: Cloudflare Workers (Static Assets)
- **Framework**: Hugo (static site generator)
- **Repository**: github.com/glw907/907-life
- **Author**: Geoffrey L. Wright
- **Email**: geoff@907.life

---

## Environment Assumptions

**This project assumes a secure development environment** where:
- API keys and secrets can be safely provided to Claude Code during setup
- Secrets are stored in `.env` files for local development (gitignored by default)
- Claude Code will configure production secrets via Wrangler CLI commands
- The Wrangler CLI is the primary tool for deployment and configuration (dashboard is optional)

This approach maximizes automation and makes the setup process scriptable and reproducible.

---

## Template Files

This repository serves as both a production site (907.life) and a template for future Hugo + Cloudflare Workers projects.

**For new projects:**
- CLAUDE-TEMPLATE.md - Generic version with placeholders
- IMPLEMENTATION-PLAN-TEMPLATE.md - Generic implementation guide

**These template files are created in Phase 10 of the implementation plan.** Copy them to start a new project and replace the placeholders with your project-specific values.

**This file (CLAUDE.md) is 907.life-specific** and serves as a working example of the completed configuration.

---

## Site Structure

### Navigation

| Item | URL | Notes |
|------|-----|-------|
| Home | `/` | Recent posts |
| Photos | `https://photos.907.life` | External, opens in new tab |
| Archives | `/archives/` | Posts by year + tag list |
| About | `/about/` | Bio + contact form |

### Footer

```
© 2025 Geoffrey L. Wright · Contact · GitHub · RSS
```

| Link | URL | Notes |
|------|-----|-------|
| Contact | `/about/#contact` | Anchor to contact form |
| GitHub | `https://github.com/glw907` | External, opens in new tab |
| RSS | `/feed.xml` | RSS feed |

### Content Organization

**Page Bundles Structure** (as of January 2026):

```
content/
├── _index.md          # Home page
├── posts/             # Blog posts (page bundles)
│   ├── YYYY-MM-DD-slug/
│   │   ├── index.md   # Post content
│   │   └── image.jpg  # Post-specific images (optional)
│   └── ...
├── archives.md        # Archives page
└── about.md           # About + contact form
```

Posts use Hugo **page bundles** (leaf bundles) for better organization:
- Each post is a directory named `YYYY-MM-DD-slug/`
- Content lives in `index.md` inside the directory
- Post-specific images/resources can be stored alongside the post
- URLs remain unchanged: `/YYYY/MM/DD/slug/`

### Taxonomy

Tags only (no categories). Common tags: `alaska`, `musings`, `technology`, `books`, `music`, `photography`

New tags can be added anytime — just use them in front matter.

---

## Deployment (2026 Approach)

### Project Structure

```
907-life/
├── wrangler.toml      # Workers configuration
├── build.sh           # Hugo build script
├── src/
│   └── worker.js      # Contact form handler
├── hugo.toml          # Hugo configuration
├── content/           # Blog content
├── layouts/           # Hugo templates
├── static/            # CSS, images
└── public/            # Build output (gitignored)
```

### Wrangler CLI (Primary Tool)

**Important:** All npx wranglercommands must be prefixed with `npx` (e.g., `npx npx wranglerlogin`) unless npx wrangleris installed globally. This ensures the correct version is used.

**Authentication:**

```bash
npx npx wranglerlogin
npx npx wranglerwhoami
```

**Deployment:**

```bash
npx wranglerdeploy
# Site available at: https://907-life.glw907.workers.dev
```

**Secrets:**

```bash
npx wranglersecret put TURNSTILE_SECRET_KEY
npx wranglersecret put RESEND_API_KEY
npx wranglersecret put CONTACT_EMAIL

npx wranglersecret list
```

### Environment Variables

| Variable | Command | Purpose |
|----------|---------|---------|
| `TURNSTILE_SECRET_KEY` | `npx wranglersecret put TURNSTILE_SECRET_KEY` | Spam protection |
| `CONTACT_EMAIL` | `npx wranglersecret put CONTACT_EMAIL` | geoff@907.life |
| `RESEND_API_KEY` | `npx wranglersecret put RESEND_API_KEY` | Email sending |

### Custom Domain

907.life is connected via:
- Cloudflare DNS (nameservers at registrar)
- Workers & Pages > 907-life > Settings > Domains & Routes

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
Email delivered to geoff@907.life
```

### Turnstile Configuration

**Production Widget (907.life domain):**
- Site key: `0x4AAAAAACPc3bf8bl6ifC3c`
- Secret key: Stored as `TURNSTILE_SECRET_KEY` in Worker secrets
- Allowed hostnames: 907.life, www.907.life

**Testing Keys (workers.dev domains):**

| Key Type | Value | Notes |
|----------|-------|-------|
| Site key (always passes) | `1x00000000000000000000AA` | Use in HTML |
| Secret key (always passes) | `1x0000000000000000000000000000000AA` | Worker auto-detects |

The worker script automatically detects testing tokens and uses the appropriate secret key.

**Update site key in:** `layouts/_default/about.html` line 45

### Resend Configuration

- **API Key**: Stored as `RESEND_API_KEY` in Worker secrets
- **From Address**: `onboarding@resend.dev` (for testing) or verified domain
- **To Address**: `geoff@907.life` (via `CONTACT_EMAIL` secret)

**For custom from address:**
1. Verify domain in Resend Dashboard
2. Add DNS records to Cloudflare
3. Update `src/worker.js` line 170

---

## Development Workflow

### Prerequisites

1. **Node.js v20+** (required for Wrangler)
   ```bash
   node --version  # Must be v20.0.0 or higher
   ```

2. **Wrangler CLI** (authenticated)
   ```bash
   npx wranglerwhoami  # Verify authentication
   ```

3. **Hugo** (static site generator)
   ```bash
   hugo version
   ```

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

**Using page bundles:**

```bash
hugo new posts/$(date +%Y-%m-%d)-my-post-slug/index.md
```

This creates a directory structure:
```
content/posts/2026-01-31-my-post-slug/
└── index.md
```

**Adding images to a post:**

1. Place images in the post bundle directory:
   ```
   content/posts/2026-01-31-my-post-slug/
   ├── index.md
   ├── photo1.jpg
   └── photo2.jpg
   ```

2. Reference in markdown (relative path):
   ```markdown
   ![Photo description](photo1.jpg)
   ```

Hugo automatically resolves the path relative to the page bundle.

### Front Matter Template

```yaml
---
title: "Post Title"
date: 2026-01-25
draft: true
tags: ["alaska", "photography"]
description: "Brief description for previews and SEO"
---
```

### Local Testing with Wrangler

```bash
# Build Hugo
hugo --gc --minify

# Run local worker (contact form works)
npx npx wranglerdev

# Preview at http://localhost:8787
```

---

## Commands Reference

### Hugo

| Command | Purpose |
|---------|---------|
| `hugo server -D` | Dev server with drafts |
| `hugo server` | Dev server, published only |
| `hugo new posts/YYYY-MM-DD-slug/index.md` | Create new post (page bundle) |
| `hugo --gc --minify` | Production build |

### Wrangler

| Command | Purpose |
|---------|---------|
| `npx wranglerlogin` | Authenticate with Cloudflare |
| `npx wranglerwhoami` | Verify authentication |
| `npx wranglerdev` | Local dev with Worker |
| `npx wranglerdeploy` | Deploy to Cloudflare |
| `npx wranglertail` | View live logs |
| `npx wranglersecret put VAR_NAME` | Set secret |
| `npx wranglersecret list` | List configured secrets |
| `npx wranglersecret delete VAR_NAME` | Remove a secret |

### Git

| Command | Purpose |
|---------|---------|
| `git add <files>` | Stage changes |
| `git commit -m "..."` | Commit locally |
| `git push` | Push (triggers auto-deploy) |

---

## Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:1313 | Hugo dev server |
| http://localhost:8787 | Wrangler dev server |
| https://907.life | Production site |
| https://907-life.glw907.workers.dev | Workers.dev URL |
| https://dash.cloudflare.com | Cloudflare dashboard |
| https://resend.com | Email service dashboard |
| https://github.com/glw907/907-life | GitHub repository |

---

## Configuration Reference

### hugo.toml Key Settings

| Setting | Value |
|---------|-------|
| baseURL | `https://907.life/` |
| title | 907.life |
| author | Geoffrey L. Wright |
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
| CONTACT_EMAIL | Yes (for form) | geoff@907.life |
| RESEND_API_KEY | Yes (for email) | Resend authentication |
| HUGO_VERSION | No | Override build.sh version |

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
name = "907-life"
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
| "Email service not configured" | Missing RESEND_API_KEY | `npx wranglersecret put RESEND_API_KEY` |
| "Email service authentication failed" | Invalid API key | Generate new key in Resend dashboard |
| "Email domain not verified" | Using custom from address | Verify domain OR use onboarding@resend.dev |
| "Too many requests" | Hit rate limit | Wait, or upgrade Resend plan |
| Form works locally, fails in production | Missing env vars | `npx wranglersecret list` to verify |

### Turnstile Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid domain" on workers.dev | Hostname not in Turnstile allowlist | Use testing keys |
| Widget doesn't appear | Site key wrong or JS blocked | Check browser console, verify site key |
| Validation always fails | Secret key mismatch | Verify TURNSTILE_SECRET_KEY |

### Node.js Issues

```bash
# Check version (must be 20+)
node --version

# If too old, use nvm:
nvm install 20
nvm use 20
```

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

## Important Notes (2024-2025 Changes)

This project reflects several significant changes in the Cloudflare ecosystem:

| What Changed | When | Impact |
|-------------|------|--------|
| **Cloudflare Pages deprecated** | April 2025 | Use Workers with Static Assets instead |
| **MailChannels discontinued** | August 2024 | Use Resend for email (or similar service) |
| **Node.js v20+ required** | 2024 | Wrangler requires modern Node.js |

If you find tutorials referencing Cloudflare Pages, Pages Functions, or MailChannels, they are outdated.
