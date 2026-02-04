# 907.life Hugo Site

Personal blog built with Hugo, deployed to Cloudflare Workers.

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

### Contact Form Requires Worker

The contact form won't work in Hugo's dev server (`hugo server`). To test:

```bash
# Build site
hugo

# Run worker locally
npx wrangler dev

# Test at http://localhost:8787/contact
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

**Rationale:** Secrets are stored encrypted in Cloudflare, not in code.

### Build Script Ensures Correct Hugo Version

Always use `./build.sh` to build the site (not `hugo` directly).

**Rationale:** The build script ensures the correct Hugo version is used (site uses specific version).

---

## Common Operations

### Development

```bash
# Start dev server
hugo server -D

# Site at http://localhost:1313
# Note: Contact form won't work (needs worker)
```

### Add a New Post

```bash
# Create post bundle
hugo new posts/2026-02-04-post-title/index.md

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
# Automatic: Push to GitHub master
git add .
git commit -m "Description"
git push origin master

# Manual (if needed)
./build.sh
npx wrangler deploy
```

### Update Contact Form Email

```bash
# Update the destination email
npx wrangler secret put CONTACT_EMAIL

# Enter: geoff@907.life (or new email)
```

---

## Project Structure

```
907-life/
├── content/
│   ├── _index.md          # Homepage
│   ├── about.md           # About page (with contact form)
│   ├── archives.md        # Archives page
│   └── posts/             # Blog posts (page bundles)
├── layouts/
│   └── _default/
│       ├── baseof.html    # Base template
│       ├── about.html     # About page (contact form)
│       ├── archives.html  # Archives listing
│       ├── list.html      # Post list
│       └── single.html    # Single post
├── static/
│   ├── css/
│   │   └── styles.css     # All styles
│   └── images/            # Site images
├── src/
│   └── worker.js          # Contact form handler
├── docs/
│   ├── architecture.md    # Design decisions
│   └── operations.md      # Dev, deploy, troubleshooting
├── hugo.toml              # Hugo configuration
├── wrangler.toml          # Worker configuration
└── build.sh               # Build script (ensures correct Hugo version)
```

---

## Worker Configuration

**File:** `src/worker.js`

**Routes:**
- `POST /contact` → Worker handles form submission
- Everything else → Static assets from Hugo

**How It Works:**
1. Hugo builds static site to `public/`
2. Wrangler deploys worker with static assets
3. Worker intercepts POST /contact for form handling
4. Worker serves static files for all other requests

**Configuration:** `wrangler.toml`
```toml
# Route POST /contact to worker
run_worker_first = ["/contact"]

# Static assets binding
[assets]
directory = "./public"
binding = "ASSETS"
```

---

## Contact Form Flow

1. User fills out form on `/contact`
2. JavaScript submits form data + Turnstile token
3. Worker validates Turnstile token with Cloudflare API
4. Worker sends email via Resend API
5. Worker returns JSON success/error response
6. JavaScript displays message to user

**Form Fields:**
- Name (required)
- Email (required)
- Subject (required)
- Message (required)
- Turnstile token (automatic)

**Secrets Required:**
- `TURNSTILE_SECRET_KEY` - Validates spam protection
- `RESEND_API_KEY` - Sends email
- `CONTACT_EMAIL` - Destination (geoff@907.life)

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Contact form not working | Check secrets configured: `npx wrangler secret list` |
| Form shows "invalid token" | Turnstile key mismatch, check site key in HTML matches dashboard |
| Email not arriving | Check Resend logs, verify domain DNS records |
| Worker not deploying | Check `wrangler.toml` syntax, run `npx wrangler deploy --dry-run` |
| CSS not updating | Hard refresh (Ctrl+Shift+R) or wait for CDN cache |
| Build errors | Run `hugo --verbose` for details |

**Full troubleshooting:** See `docs/operations.md`

---

## Deployment Info

**Production Site:** https://907.life
**Repository:** https://github.com/glw907/907-life

**Deployment Flow:**
1. Push to GitHub master
2. GitHub Actions runs `build.sh`
3. Deploys via Wrangler
4. Live in 1-2 minutes

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
- **Turnstile Dashboard:** https://dash.cloudflare.com/?to=/:account/turnstile
- **Resend Dashboard:** https://resend.com/
- **Hugo Docs:** https://gohugo.io/documentation/
- **Workers Docs:** https://developers.cloudflare.com/workers/
