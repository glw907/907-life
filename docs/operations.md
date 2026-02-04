# Operations Guide

Development, deployment, and troubleshooting for 907.life.

---

## Development

### Running Local Server

```bash
# Start Hugo development server
hugo server -D

# Site available at http://localhost:1313
# Auto-rebuilds on file changes
```

**Testing Contact Form Locally:**

The contact form requires a Cloudflare Worker, which doesn't run in Hugo's dev server. To test:

1. Build the site: `hugo`
2. Run wrangler dev: `npx wrangler dev`
3. Test at: `http://localhost:8787/contact`

**Note:** You'll need secrets configured in `.dev.vars` for local testing:
```
TURNSTILE_SECRET_KEY=your_key_here
RESEND_API_KEY=your_key_here
CONTACT_EMAIL=geoff@907.life
```

See `.env.example` for reference.

### Adding a New Post

```bash
# Create new post
hugo new posts/2026-02-04-post-title/index.md

# Directory structure:
# posts/
#   2026-02-04-post-title/
#     index.md
#     image.jpg (optional)
```

**Front Matter Template:**
```yaml
---
title: "Post Title"
date: 2026-02-04
draft: false
tags: ["tag1", "tag2"]
---
```

---

## Deployment

### Overview

Site deploys to Cloudflare Workers via GitHub Actions on push to master.

**Production Site:** https://907.life
**Repository:** https://github.com/glw907/907-life

### Automatic Deployment

**How It Works:**
1. Push to GitHub master branch
2. GitHub Actions:
   - Runs `build.sh` to build Hugo site
   - Deploys worker + static assets via Wrangler
   - Completes in 1-2 minutes
3. Site live at 907.life

**Workflow:**
```bash
git add .
git commit -m "Description of changes"
git push origin master
```

### Manual Deployment

**Prerequisites:**
```bash
# Install wrangler
npm install -g wrangler

# Authenticate
wrangler login
```

**Deploy:**
```bash
# Build and deploy
./build.sh
npx wrangler deploy
```

### Secrets Configuration

Secrets are configured in Cloudflare dashboard (Workers & Pages → 907-life → Settings → Variables).

**Required Secrets:**
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret key
- `RESEND_API_KEY` - Resend API key
- `CONTACT_EMAIL` - Destination email (geoff@907.life)

**To update:**
```bash
# Via CLI
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_EMAIL

# Via Dashboard
# Workers & Pages → 907-life → Settings → Variables → Edit
```

---

## Contact Form Configuration

### Turnstile Setup

**Turnstile Site:**
- Dashboard: https://dash.cloudflare.com/?to=/:account/turnstile
- Site Key: (visible in dashboard, used in HTML)
- Secret Key: (stored in worker secrets)

**To rotate keys:**
1. Generate new key in Turnstile dashboard
2. Update worker secret: `npx wrangler secret put TURNSTILE_SECRET_KEY`
3. Update site key in `layouts/_default/about.html`
4. Deploy

### Resend Setup

**Domain:** 907.life

**DNS Records (already configured in Cloudflare):**
- SPF: TXT record
- DKIM: TXT record

**To verify domain:**
```bash
curl -s "https://api.resend.com/domains" \
  -H "Authorization: Bearer $RESEND_API_KEY" | jq
```

**To rotate API key:**
1. Generate new key in Resend dashboard
2. Update worker secret: `npx wrangler secret put RESEND_API_KEY`
3. Test form submission

---

## Troubleshooting

### Contact Form Not Working

**Check secrets are configured:**
```bash
npx wrangler secret list
```

Should show:
- TURNSTILE_SECRET_KEY
- RESEND_API_KEY
- CONTACT_EMAIL

**Test Turnstile token validation:**
```bash
# Submit form and check worker logs
npx wrangler tail
```

**Test Resend email delivery:**
```bash
# Check Resend logs
curl "https://api.resend.com/emails" \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

### Worker Not Deploying

**Check wrangler.toml syntax:**
```bash
npx wrangler deploy --dry-run
```

**Check build output:**
```bash
./build.sh
# Should create public/ directory with Hugo output
```

**Check worker logs:**
```bash
npx wrangler tail
```

### CSS Not Updating

**In development:**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache

**In production:**
- Check Hugo build included CSS: `ls -la public/css/`
- Hard refresh to bypass CDN cache
- Wait a few minutes for CDN to update

### Build Errors

**Hugo version mismatch:**

The site uses a specific Hugo version. Check `build.sh` for the version.

**Common errors:**
- Missing front matter fields
- Invalid YAML syntax
- Broken internal links

Run Hugo with verbose output:
```bash
hugo --verbose
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `hugo server -D` |
| Test contact form locally | `npx wrangler dev` |
| Build site | `./build.sh` or `hugo` |
| Deploy to production | `npx wrangler deploy` |
| View worker logs | `npx wrangler tail` |
| List secrets | `npx wrangler secret list` |
| Update secret | `npx wrangler secret put SECRET_NAME` |

---

## Additional Resources

### Cross-Site Admin

For DNS, domain verification, or service configuration:
```bash
cd ~/Projects/cloudflare-sites
claude
```

### External Documentation

- **Hugo:** https://gohugo.io/documentation/
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Turnstile:** https://developers.cloudflare.com/turnstile/
- **Resend:** https://resend.com/docs
- **Wrangler:** https://developers.cloudflare.com/workers/wrangler/
