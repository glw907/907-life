# 907.life Implementation Plan

A phased approach to building a Hugo blog hosted on Cloudflare Workers (Static Assets).

**Note (Updated January 2025)**: Cloudflare deprecated Pages in April 2025 in favor of Workers with Static Assets. This plan has been updated to reflect the new deployment approach. Key changes:
- Phase 5: Uses MailChannels instead of Fastmail JMAP for email
- Phase 6: Uses Cloudflare Workers with Static Assets instead of Pages
- Worker script (`src/worker.js`) handles both static files and contact form

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
- Include "Ubuntu 24.04" in searches
- Don't exhaust all local options first

### Sudo Usage
- Use `sudo -A` for privileged commands
- Always ask permission before running sudo commands

### Model Selection
- **Sonnet**: Use for routine implementation — following the plan, writing code, running commands
- **Opus**: Switch to Opus for:
  - Unexpected architectural decisions
  - Significant replanning or troubleshooting
  - Complex integrations (e.g., Phase 5 JMAP if issues arise)
  - Adding major features not in this plan
  - Any situation where you're "stuck" and need deeper reasoning

---

## Phase 1: Environment Setup

**Goal**: Prepare the local development environment and accounts.

### Tasks

| Task | Details |
|------|---------|
| **1.1 Install Hugo** | `sudo -A apt install hugo` |
| **1.2 Create Cloudflare Account** | Sign up at https://dash.cloudflare.com (free tier) |
| **1.3 Archive Old Repository** | `gh repo rename 907-life 907-life-archive --repo glw907/907-life` |
| **1.4 Initialize New Repository** | Set up git in `~/Projects/907-life`, push to GitHub |
| **1.5 Install VSCodium Extensions** | Hugo, Markdown, YAML, HTML, Git, Project Manager |
| **1.6 Configure VSCodium Workspace** | Create `.vscode/settings.json` and `.vscode/tasks.json` |
| **1.7 Update CLAUDE.md** | Document actual Hugo version, extensions installed, any issues |

### 1.1 Install Hugo

```bash
sudo -A apt update
sudo -A apt install hugo
hugo version  # Verify installation
```

Expected version: 0.123.7 or similar (apt version is fine for this project).

### 1.2 Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Create free account
3. Verify email
4. Note: Domain and Pages configuration comes in Phase 6

### 1.3 Archive Old Repository

```bash
gh repo rename 907-life 907-life-archive --repo glw907/907-life
```

### 1.4 Initialize New Repository

```bash
cd ~/Projects/907-life
git init
git add CLAUDE.md IMPLEMENTATION_PLAN.md
git commit -m "Initial commit: project documentation"
gh repo create 907-life --public --source=. --remote=origin --push
```

### 1.5 VSCodium Extensions

Install these extensions (`Ctrl+Shift+X`):

| Extension ID | Purpose |
|--------------|---------|
| `budparr.language-hugo-vscode` | Hugo template syntax |
| `yzhang.markdown-all-in-one` | Markdown editing |
| `davidanson.vscode-markdownlint` | Markdown linting |
| `redhat.vscode-yaml` | YAML support (front matter) |
| `formulahendry.auto-rename-tag` | Auto-rename HTML tags |
| `formulahendry.auto-close-tag` | Auto-close HTML tags |
| `mhutchie.git-graph` | Visualize git history |
| `alefragnani.project-manager` | Project list/switching |

After installing Project Manager:
1. `Ctrl+Shift+P` → "Project Manager: Save Project"
2. Name: `907-life`

### Completion Checklist

- [ ] `hugo version` returns 0.123.7+
- [ ] Cloudflare account created and verified
- [ ] Old repo archived as `907-life-archive`
- [ ] New repo at `github.com/glw907/907-life`
- [ ] VSCodium opens project with extensions working
- [ ] Project saved in Project Manager
- [ ] CLAUDE.md updated with Phase 1 specifics

---

## Phase 2: Hugo Project Foundation

**Goal**: Initialize Hugo and establish basic project structure.

### Tasks

| Task | Details |
|------|---------|
| **2.1 Initialize Hugo Site** | `hugo new site . --force` |
| **2.2 Configure hugo.toml** | Base URL, title, author, pagination, permalinks, menu, outputs |
| **2.3 Define Taxonomy** | Tags only (no categories) |
| **2.4 Create Directory Structure** | content/, static/, functions/, .vscode/ |
| **2.5 Create .gitignore** | Exclude build artifacts, secrets |
| **2.6 Commit and Push** | Push foundation to GitHub |
| **2.7 Update CLAUDE.md** | Document config decisions |

### 2.1 Initialize Hugo Site

```bash
cd ~/Projects/907-life
hugo new site . --force
```

### 2.2 Configure hugo.toml

```toml
# 907.life Hugo Configuration

baseURL = "https://907.life/"
languageCode = "en-us"
title = "907.life"

# Author
[params]
  author = "Geoffrey L. Wright"
  description = "Alaska adventures, philosophical musings, technology, books, music, photography, and whatever else comes to mind."
  email = "geoff@907.life"

# Pagination
[pagination]
  pagerSize = 20
  path = "page"

# Permalinks
[permalinks]
  posts = "/:year/:month/:day/:slug/"

# Taxonomies - tags only, no categories
[taxonomies]
  tag = "tags"

# Menu configuration
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

# Markup configuration
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

  [markup.highlight]
    codeFences = true
    guessSyntax = false
    lineNos = false
    style = "monokai"

# Output formats
[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]

# RSS configuration
[outputFormats.RSS]
  mediaType = "application/rss+xml"
  baseName = "feed"

# JSON feed configuration
[outputFormats.JSON]
  mediaType = "application/json"
  baseName = "feed"
  isPlainText = true

# Privacy - disable third-party tracking
[privacy]
  [privacy.disqus]
    disable = true
  [privacy.googleAnalytics]
    disable = true
  [privacy.instagram]
    disable = true
  [privacy.twitter]
    disable = true
  [privacy.vimeo]
    disable = true
  [privacy.youtube]
    disable = true
```

### 2.4 Create Directory Structure

```bash
mkdir -p content/posts
mkdir -p static/css
mkdir -p static/images
mkdir -p functions
mkdir -p layouts/_default
mkdir -p layouts/partials
```

### 2.5 Create .gitignore

```
# Hugo build output
public/
resources/
.hugo_build.lock

# Environment and secrets
.env
.env.local

# Node (for Wrangler if used)
node_modules/

# OS files
.DS_Store
Thumbs.db

# Editor
*.swp
*.swo
*~
```

### Completion Checklist

- [ ] `hugo server` runs without errors
- [ ] Empty site loads at localhost:1313
- [ ] hugo.toml configured with all settings
- [ ] Directory structure in place
- [ ] .gitignore created
- [ ] Pushed to GitHub
- [ ] CLAUDE.md updated

---

## Phase 3: Theme Migration

**Goal**: Port the custom theme from the archived repository and adapt for new structure.

### Tasks

| Task | Details |
|------|---------|
| **3.1 Fetch Theme Files** | Pull from `907-life-archive`: layouts/, static/css/ |
| **3.2 Adapt Base Templates** | Update baseof.html, head.html for new config |
| **3.3 Update Navigation** | New menu with Photos external link (↗, new tab) |
| **3.4 Update Partials** | header.html, footer.html, navigation.html |
| **3.5 Create Archives Layout** | Posts by year + tag list |
| **3.6 Create Tag Templates** | taxonomy.html, term.html |
| **3.7 Update Footer** | © Geoffrey L. Wright · Contact · GitHub ↗ · RSS |
| **3.8 Test Theme** | Verify all pages render correctly |
| **3.9 Update CLAUDE.md** | Document template structure, customizations |

### 3.1 Fetch Theme Files

```bash
# Clone archived repo temporarily
cd /tmp
gh repo clone glw907/907-life-archive

# Copy theme files
cp -r /tmp/907-life-archive/layouts/* ~/Projects/907-life/layouts/
cp -r /tmp/907-life-archive/static/* ~/Projects/907-life/static/
cp -r /tmp/907-life-archive/archetypes/* ~/Projects/907-life/archetypes/

# Clean up
rm -rf /tmp/907-life-archive
```

### 3.3 Navigation Updates

Update `layouts/partials/navigation.html`:
- Home, Photos, Archives, About
- Photos link: external with ↗ indicator, opens in new tab

```html
{{ range .Site.Menus.main }}
  {{ if .Params.external }}
    <a href="{{ .URL }}" target="_blank" rel="noopener">{{ .Name }} ↗</a>
  {{ else }}
    <a href="{{ .URL }}"{{ if $.IsMenuCurrent "main" . }} class="active"{{ end }}>{{ .Name }}</a>
  {{ end }}
{{ end }}
```

### 3.5 Archives Layout

`layouts/_default/archives.html`:

Structure:
- Tag list at top (simple, alphabetical)
- Posts grouped by year
- Each post: date + title link

### 3.7 Footer Updates

`layouts/partials/footer.html`:

```html
<footer>
  <p>&copy; {{ now.Year }} Geoffrey L. Wright ·
    <a href="/about/#contact">Contact</a> ·
    <a href="https://github.com/glw907" target="_blank" rel="noopener">GitHub ↗</a> ·
    <a href="/feed.xml">RSS</a>
  </p>
</footer>
```

### Completion Checklist

- [ ] All layouts in place
- [ ] CSS loads correctly
- [ ] Navigation shows: Home, Photos ↗, Archives, About
- [ ] Photos link opens photos.907.life in new tab
- [ ] Footer shows: © Geoffrey L. Wright · Contact · GitHub ↗ · RSS
- [ ] Archives layout supports year grouping + tag list
- [ ] Tag pages render correctly
- [ ] CLAUDE.md updated

---

## Phase 4: Content Pages

**Goal**: Create the static pages and content structure.

### Tasks

| Task | Details |
|------|---------|
| **4.1 Home Page** | content/_index.md — recent posts, no intro text |
| **4.2 Archives Page** | content/archives.md — by year + tags |
| **4.3 About Page** | content/about.md — bio + contact form (#contact anchor) |
| **4.4 Post Archetype** | archetypes/posts.md — front matter template |
| **4.5 Sample Posts** | Create 3-5 test posts across tags and dates |
| **4.6 Update CLAUDE.md** | Document content structure |

### 4.1 Home Page

`content/_index.md`:

```markdown
---
title: "907.life"
---
```

No content needed — layout displays recent posts.

### 4.2 Archives Page

`content/archives.md`:

```markdown
---
title: "Archives"
layout: "archives"
---
```

### 4.3 About Page

`content/about.md`:

```markdown
---
title: "About"
layout: "about"
---

## About Geoffrey

[Placeholder: 2-3 paragraphs about background, interests, Alaska]

[Placeholder: What this blog is about]

---

## Contact {#contact}

I'd love to hear from you. Drop me a message below.

[Contact form HTML here — Turnstile added in Phase 5]
```

### 4.4 Post Archetype

`archetypes/posts.md`:

```yaml
---
title: "{{ replace .File.ContentBaseName `-` ` ` | title }}"
date: {{ .Date }}
draft: true
tags: []
description: ""
---

```

### 4.5 Sample Posts

Create test posts to verify archives and tags:

| File | Date | Tags |
|------|------|------|
| `2025-01-23-testing-the-new-site.md` | 2025-01-23 | technology |
| `2025-01-10-winter-prior-lake.md` | 2025-01-10 | alaska, photography |
| `2024-12-15-book-notes-example.md` | 2024-12-15 | books |
| `2024-12-01-favorite-albums-2024.md` | 2024-12-01 | music |
| `2024-11-20-quick-thoughts.md` | 2024-11-20 | musings |

### Completion Checklist

- [ ] Home page displays recent posts (no intro text)
- [ ] Archives page shows posts grouped by year
- [ ] Archives page shows simple tag list
- [ ] Tag pages work (`/tags/{tag}/`)
- [ ] About page displays with #contact anchor
- [ ] Contact link in footer jumps to form section
- [ ] Post archetype creates correct front matter
- [ ] Sample posts created and displaying
- [ ] CLAUDE.md updated

---

## Phase 5: Contact Form Backend

**Goal**: Implement spam-protected contact form with email delivery.

**Note (Updated January 2025)**: The original plan used Cloudflare Pages Functions (`functions/contact.js`). Due to Pages deprecation in April 2025, the contact form now uses a Cloudflare Worker script (`src/worker.js`) that handles both static assets AND form submissions. The wrangler.toml configuration and Worker script are created in Phase 6.

### Tasks

| Task | Details |
|------|---------|
| **5.1 Set Up Cloudflare Turnstile** | Create widget, get site key + secret key |
| **5.2 Add Turnstile to Form** | Widget script + div on About page |
| **5.3 Create Form Handler Logic** | Contact form validation and email sending |
| **5.4 Configure MailChannels** | Free email for Cloudflare Workers |
| **5.5 Add Form Feedback UI** | JavaScript success/error messages |
| **5.6 Document Environment Variables** | Create .env.example |
| **5.7 Update CLAUDE.md** | Document form flow, env vars |

### 5.1 Cloudflare Turnstile Setup

1. Cloudflare Dashboard → Turnstile → Add site
2. Site name: `907.life`
3. Domain: `907.life`
4. Widget mode: **Managed**
5. Copy Site Key and Secret Key

### 5.2 Add Turnstile to Form

In About page / contact layout:

```html
<form id="contact-form" action="/contact" method="POST">
  <div class="form-row">
    <input type="text" name="name" placeholder="Name" required>
    <input type="email" name="email" placeholder="Email" required>
  </div>
  <input type="text" name="subject" placeholder="Subject" required>
  <textarea name="message" placeholder="Message" required></textarea>

  <!-- Turnstile widget -->
  <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>

  <button type="submit">Send Message</button>
  <div id="form-status"></div>
</form>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

### 5.3 Contact Form Handler Logic

The contact form handler is implemented in the Worker script (`src/worker.js`, created in Phase 6). The logic includes:

1. Parse form data from POST request
2. Validate required fields (name, email, subject, message)
3. Validate Turnstile token via Cloudflare API
4. Send email via MailChannels API
5. Return JSON response (success or error)

See Phase 6.2 for the complete Worker script implementation.

### 5.4 MailChannels Configuration

MailChannels is a free email service for Cloudflare Workers. No additional credentials needed!

Email format:
- From: `907.life Contact Form <noreply@907.life>`
- Reply-To: Sender's email
- To: `geoff@907.life` (from CONTACT_EMAIL env var)
- Subject: `[907.life] {form subject}`
- Body: Plain text with sender info and message

### 5.6 Environment Variables

Create `.env.example`:

```
# Cloudflare Turnstile
# Site Key (public): 0x4AAAAAACPc3bf8bl6ifC3c (in about.html)
# Secret Key (private): Add to Cloudflare Workers environment variables
TURNSTILE_SECRET_KEY=

# Contact destination
CONTACT_EMAIL=geoff@907.life

# Note: Email is sent via MailChannels (free for Cloudflare Workers)
# No additional email credentials needed!
```

**Note**: Actual values set in Cloudflare Workers dashboard (Settings → Variables), NOT in git.

### Completion Checklist

- [ ] Turnstile widget appears on form
- [ ] Form handler logic defined (for Worker script)
- [ ] MailChannels integration understood
- [ ] Email format defined (subject prefix, Reply-To)
- [ ] Success/error feedback displays
- [ ] .env.example documents required vars
- [ ] CLAUDE.md updated

---

## Phase 6: Cloudflare Workers Deployment

**Goal**: Deploy site to Cloudflare Workers with Static Assets and custom domain.

**Updated January 2026**: This phase reflects the current Cloudflare Workers Git integration process. Key points:
- Cloudflare deprecated Pages in April 2025 in favor of Workers with Static Assets
- The dashboard UI is simplified; most configuration comes from wrangler.toml
- You will NOT see a "Build output directory" field - this is in wrangler.toml
- A build.sh script is recommended for Hugo version control

### Tasks

| Task | Details |
|------|---------|
| **6.1 Create wrangler.toml** | Configure Workers build and static assets |
| **6.2 Create build.sh** | Build script for consistent Hugo version |
| **6.3 Create Worker Script** | Handle contact form POST requests |
| **6.4 Connect Repo to Cloudflare Workers** | Link GitHub, configure automatic builds |
| **6.5 Initial Deployment** | Verify at 907-life.{account}.workers.dev |
| **6.6 Configure Environment Variables** | Add secrets in dashboard |
| **6.7 Transfer DNS to Cloudflare** | Move from ClouDNS |
| **6.8 Add Custom Domain** | Connect 907.life to Worker |
| **6.9 Configure www Redirect** | Redirect www → apex |
| **6.10 Verify SSL/HTTPS** | Confirm certificate active |
| **6.11 Test Production** | Full end-to-end test |
| **6.12 Update CLAUDE.md** | Document deployment |

### 6.1 Create wrangler.toml

Create `wrangler.toml` in project root. This file controls all build and deployment settings:

```toml
# 907.life - Cloudflare Workers Configuration
name = "907-life"
compatibility_date = "2025-01-25"

# Build configuration - uses build.sh for Hugo version control
[build]
command = "chmod +x build.sh && ./build.sh"

# Static assets from Hugo output directory
[assets]
directory = "./public"
binding = "ASSETS"
not_found_handling = "404-page"

# Run worker first for contact form route
run_worker_first = ["/contact"]

# Worker script for contact form handling
main = "src/worker.js"

# Environment variables set in Cloudflare dashboard:
# - TURNSTILE_SECRET_KEY (encrypted)
# - CONTACT_EMAIL (plain text)
```

**Important**: The `name` field MUST match the Worker name you'll create in the Cloudflare dashboard, or builds will fail.

### 6.2 Create build.sh

Create `build.sh` in project root. This script downloads a specific Hugo version to ensure consistent builds:

```bash
#!/usr/bin/env bash
# Build script for 907.life Hugo site on Cloudflare Workers
set -euo pipefail

# Configuration - can be overridden via HUGO_VERSION env var
HUGO_VERSION="${HUGO_VERSION:-0.123.7}"
export TZ=UTC

echo "Starting Hugo build process..."
echo "Hugo version: ${HUGO_VERSION}"

# Download Hugo extended
curl -sLO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"

# Extract and install
tar -xf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
mkdir -p /opt/buildhome
cp hugo /opt/buildhome/
export PATH="/opt/buildhome:$PATH"

# Clean up
rm -f LICENSE README.md "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"

# Verify and build
hugo version
hugo --gc --minify

echo "Build completed successfully!"
```

Make it executable:
```bash
chmod +x build.sh
```

**Why build.sh?** The Cloudflare Workers build environment has a pre-installed Hugo version that may not match your local version. The build script ensures consistent builds by downloading the exact version you specify.

### 6.3 Create Worker Script

Create `src/worker.js`:

```javascript
/**
 * Cloudflare Worker: 907.life
 * - Serves static assets from Hugo build
 * - Handles POST /contact for contact form
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle contact form POST
    if (url.pathname === '/contact' && request.method === 'POST') {
      return handleContactForm(request, env);
    }

    // Serve static assets for all other requests
    return env.ASSETS.fetch(request);
  }
};

async function handleContactForm(request, env) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const turnstileToken = formData.get('cf-turnstile-response');

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers }
      );
    }

    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ error: 'Turnstile validation required' }),
        { status: 400, headers }
      );
    }

    // Validate Turnstile token
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    );

    const turnstileResult = await turnstileResponse.json();
    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({ error: 'Turnstile validation failed. Please try again.' }),
        { status: 400, headers }
      );
    }

    // Send email via MailChannels
    const emailSent = await sendEmailViaMailChannels({
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[907.life] ${subject}`,
      name: name,
      senderEmail: email,
      message: message,
    });

    if (!emailSent) {
      return new Response(
        JSON.stringify({ error: 'Failed to send email. Please try again later.' }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again later.' }),
      { status: 500, headers }
    );
  }
}

async function sendEmailViaMailChannels(params) {
  const { to, replyTo, subject, name, senderEmail, message } = params;

  try {
    const emailBody = `From: ${name} <${senderEmail}>

Message:
${message}

---
Sent via 907.life contact form`;

    const emailRequest = {
      personalizations: [
        {
          to: [{ email: to }],
          reply_to: { email: replyTo, name: name },
        },
      ],
      from: {
        email: 'noreply@907.life',
        name: '907.life Contact Form',
      },
      subject: subject,
      content: [
        {
          type: 'text/plain',
          value: emailBody,
        },
      ],
    };

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailRequest),
    });

    if (!response.ok) {
      console.error('MailChannels error:', response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('MailChannels send error:', error);
    return false;
  }
}
```

### 6.4 Connect Repository to Cloudflare Workers

**Important**: The Worker name in the dashboard MUST match the `name` in wrangler.toml (`907-life`).

#### Step-by-Step Dashboard Process (January 2026)

1. **Navigate to Workers & Pages**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to **Compute (Workers)** → **Workers & Pages**

2. **Create New Worker**
   - Click **Create** (or **Create application**)
   - Under "Get started", select **Import a repository**

3. **Connect GitHub**
   - If first time: Click **Connect to Git** and authorize Cloudflare
   - Select your GitHub account
   - Choose repository: `glw907/907-life`

4. **Configure Build Settings**

   The dashboard shows a simplified configuration screen. You will see:

   | Field | What to Enter | Notes |
   |-------|---------------|-------|
   | Worker name | `907-life` | **MUST match `name` in wrangler.toml** |
   | Production branch | `main` | Branch that triggers production deploys |
   | Root directory | (leave empty) | Only set for monorepos |

   **What you will NOT see:**
   - "Build output directory" - This is configured in wrangler.toml under `[assets] directory`
   - "Build command" - Auto-detected from wrangler.toml `[build] command`

   The dashboard reads your wrangler.toml for most settings.

5. **Save and Deploy**
   - Click **Save and Deploy** (or **Create and Deploy**)
   - Wait 2-3 minutes for the first build

#### What Happens During Build

1. Cloudflare clones your repository
2. Runs `chmod +x build.sh && ./build.sh` (from wrangler.toml)
3. build.sh downloads Hugo and runs `hugo --gc --minify`
4. Hugo outputs to `./public`
5. Cloudflare uploads `./public` to its CDN (from `[assets] directory`)
6. Worker script (`src/worker.js`) is deployed

### 6.5 Initial Deployment

After clicking "Save and Deploy":

1. **Monitor Build**
   - Watch the build progress in the dashboard
   - First build takes 2-3 minutes (Hugo download + build)
   - Subsequent builds are faster (~1-2 minutes)

2. **Verify Deployment**
   - Worker URL: `https://907-life.{your-subdomain}.workers.dev`
   - Open the URL and verify the site loads
   - Check all pages render correctly

3. **Review Build Logs**
   - Go to **Deployments** tab
   - Click on the deployment to see build logs
   - Look for "Build completed successfully!" from build.sh

4. **Troubleshoot if Needed**
   - If build fails, check logs for Hugo version issues
   - Verify wrangler.toml syntax
   - Ensure build.sh is committed and executable

### 6.6 Configure Environment Variables

After initial deployment, add environment variables for the contact form:

1. Go to **Workers & Pages** → **907-life** → **Settings** → **Variables**
2. Click **Add variable** for each:

| Variable | Value | Type | Purpose |
|----------|-------|------|---------|
| `TURNSTILE_SECRET_KEY` | `0x4AAAAAACPc3X9Ux49F7FaTgulwsatcOZA` | Encrypted | Turnstile spam protection |
| `CONTACT_EMAIL` | `geoff@907.life` | Plain text | Where form submissions go |

3. Click **Deploy** to apply changes

**Note**: Variables are NOT automatically deployed. You must click Deploy after adding them.

**Optional Build Variable:**
If you want to override the Hugo version in build.sh:
- Add `HUGO_VERSION` = `0.123.7` (or your preferred version) as a Build Variable

### 6.7 Transfer DNS to Cloudflare

1. **Cloudflare Dashboard** → Add a site → `907.life` → Free plan
2. Cloudflare provides nameservers (e.g., `anna.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
3. At ClouDNS: Update nameservers to Cloudflare's
4. Wait for propagation (minutes to hours)
5. Cloudflare dashboard shows domain as "Active"

### 6.8 Add Custom Domain

1. **Workers & Pages** → 907-life → **Settings** → **Domains & Routes**
2. Click **"Add"** → **"Custom domain"**
3. Enter: `907.life`
4. Cloudflare auto-configures DNS (since DNS is now on Cloudflare)
5. SSL certificate provisioned automatically

### 6.9 Configure www Redirect

**Cloudflare Dashboard → Rules → Redirect Rules:**

- **Rule name**: www to apex
- **If**: Hostname equals `www.907.life`
- **Then**: Redirect to `https://907.life${http.request.uri.path}` (301 Permanent)

### 6.10 Verify SSL/HTTPS

- Check https://907.life loads with valid certificate
- Check HTTP automatically redirects to HTTPS
- Check www.907.life redirects to 907.life

### 6.11 Test Production

| Test | Expected |
|------|----------|
| https://907.life | Home page loads |
| Navigation | All links work |
| /about/#contact | Scrolls to form |
| Submit contact form | Success message, email received |
| /nonexistent | 404 page shown |

### Completion Checklist

- [ ] wrangler.toml created and committed
- [ ] build.sh created, executable, and committed
- [ ] src/worker.js created and committed
- [ ] Repository connected to Cloudflare Workers (name matches wrangler.toml)
- [ ] First build completes successfully
- [ ] Site deploys on push to main
- [ ] https://907-life.{subdomain}.workers.dev works
- [ ] Environment variables configured (TURNSTILE_SECRET_KEY, CONTACT_EMAIL)
- [ ] DNS transferred to Cloudflare
- [ ] https://907.life works with valid SSL
- [ ] www.907.life redirects to 907.life
- [ ] HTTP redirects to HTTPS
- [ ] Contact form works in production
- [ ] CLAUDE.md updated

### Alternative: Using Wrangler CLI

If you prefer command-line deployment instead of Git integration:

```bash
# Install wrangler (if not already)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build Hugo site
hugo --gc --minify

# Deploy
wrangler deploy
```

### Troubleshooting

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Worker name mismatch | "Worker 'X' not found" error | Ensure `name` in wrangler.toml matches exactly what you entered in the dashboard |
| Hugo not found | "hugo: command not found" | Verify build.sh is committed and executable (`chmod +x build.sh`) |
| Build timeout | Build runs forever | Check build.sh for syntax errors; Hugo builds should take seconds |
| 404 on all pages | Site loads but shows 404 | Verify `[assets] directory = "./public"` and Hugo outputs to public/ |
| Contact form 404 | Form submission fails with 404 | Check `run_worker_first = ["/contact"]` in wrangler.toml |
| Env vars not working | Contact form errors | Go to Settings → Variables, add vars, then click **Deploy** |
| Wrong Hugo version | Theme/build inconsistencies | Set `HUGO_VERSION` as Build Variable or update build.sh |

**Viewing Build Logs:**
1. Workers & Pages → 907-life → Deployments
2. Click on a deployment
3. View "Build output" for detailed logs

**Testing Locally with Wrangler:**
```bash
# Build Hugo first
hugo --gc --minify

# Test with wrangler dev
npx wrangler dev

# Site available at http://localhost:8787
```

---

---

## Phase 7: Development Workflow

**Goal**: Establish smooth edit → preview → publish workflow.

### Tasks

| Task | Details |
|------|---------|
| **7.1 VSCodium Settings** | .vscode/settings.json |
| **7.2 VSCodium Tasks** | .vscode/tasks.json — server, new post, publish |
| **7.3 Keyboard Shortcuts** | Ctrl+Alt+P for Publish |
| **7.4 Shell Aliases** | blog, newpost, blogpush |
| **7.5 Test Full Workflow** | Create → preview → publish cycle |
| **7.6 Update CLAUDE.md** | Document workflow |

### 7.1 VSCodium Settings

`.vscode/settings.json`:

```json
{
  "files.associations": {
    "*.html": "html"
  },
  "editor.wordWrap": "on",
  "editor.formatOnSave": true,
  "editor.rulers": [80],

  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.quickSuggestions": {
      "other": true,
      "comments": false,
      "strings": true
    }
  },

  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "files.exclude": {
    "public/": true,
    "resources/": true,
    ".hugo_build.lock": true
  },

  "markdown.preview.breaks": true
}
```

### 7.2 VSCodium Tasks

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Hugo: Start Server",
      "type": "shell",
      "command": "hugo server -D",
      "group": "build",
      "isBackground": true,
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Hugo: Build",
      "type": "shell",
      "command": "hugo",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "New Post",
      "type": "shell",
      "command": "hugo new posts/$(date +%Y-%m-%d)-${input:postSlug}.md",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always"
      }
    },
    {
      "label": "Publish",
      "type": "shell",
      "command": "git add -A && git commit -m \"${input:commitMessage}\" && git push",
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always"
      }
    },
    {
      "label": "Quick Publish",
      "type": "shell",
      "command": "git add -A && git commit -m \"Update site content\" && git push",
      "group": "build",
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "postSlug",
      "description": "Post slug (lowercase, hyphens)",
      "type": "promptString",
      "default": "new-post"
    },
    {
      "id": "commitMessage",
      "description": "Commit message",
      "type": "promptString",
      "default": "Update site content"
    }
  ]
}
```

### 7.3 Keyboard Shortcuts

Add to VSCodium keybindings (`Ctrl+Shift+P` → "Open Keyboard Shortcuts (JSON)"):

```json
[
  {
    "key": "ctrl+alt+p",
    "command": "workbench.action.tasks.runTask",
    "args": "Publish"
  }
]
```

### 7.4 Shell Aliases

Add to `~/.bashrc`:

```bash
# 907.life shortcuts
alias blog="cd ~/Projects/907-life && codium . && hugo server -D"
alias newpost='cd ~/Projects/907-life && hugo new posts/$(date +%Y-%m-%d)-'
alias blogpush='cd ~/Projects/907-life && git add -A && git commit -m "Update site content" && git push'
```

Then: `source ~/.bashrc`

### Completion Checklist

- [ ] .vscode/settings.json configured
- [ ] .vscode/tasks.json with all tasks
- [ ] Can start server via Run Task
- [ ] Can create new post via Run Task
- [ ] Ctrl+Alt+P runs Publish task
- [ ] Quick Publish works
- [ ] Shell aliases added and working
- [ ] Full workflow tested end-to-end
- [ ] CLAUDE.md updated

---

## Phase 8: Final Testing

**Goal**: Verify everything works end-to-end.

### Tasks

| Task | Details |
|------|---------|
| **8.1 Local Development Tests** | Server, live reload, tasks |
| **8.2 Production Site Tests** | All pages, navigation, links |
| **8.3 Contact Form Tests** | Submission, email format, reply-to |
| **8.4 Cross-Device Testing** | Mobile, tablet, different browsers |
| **8.5 Feed Validation** | RSS and JSON feeds |
| **8.6 Performance Check** | PageSpeed, accessibility basics |
| **8.7 Fix Any Issues** | Address problems found |
| **8.8 Update CLAUDE.md** | Final documentation review |

### 8.1 Local Development Tests

| Test | Expected |
|------|----------|
| Run Task → "Hugo: Start Server" | Server starts at localhost:1313 |
| Edit and save a post | Browser auto-refreshes |
| Run Task → "New Post" | New file with correct front matter |
| Ctrl+Alt+P | Prompts for commit message, pushes |

### 8.2 Production Site Tests

| URL | Verify |
|-----|--------|
| https://907.life | Home loads, recent posts display |
| https://907.life/archives/ | Posts by year, tag list visible |
| https://907.life/tags/alaska/ | Shows posts with that tag |
| https://907.life/about/ | Bio + form visible |
| https://907.life/about/#contact | Scrolls to form |
| Click "Photos" in nav | Opens photos.907.life in new tab |
| https://907.life/nonexistent/ | 404 page |

### 8.3 Contact Form Tests

| Test | Expected |
|------|----------|
| Load About page | Turnstile widget visible |
| Submit empty form | Validation prevents |
| Submit valid form | Success message appears |
| Check email | Arrives with [907.life] subject |
| Reply to email | Goes to sender's address |

### 8.4 Cross-Device Testing

- [ ] Desktop Chrome/Firefox
- [ ] Mobile phone (responsive layout, nav works)
- [ ] Tablet
- [ ] No horizontal scrolling on mobile
- [ ] Form usable on touch devices

### 8.5 Feed Validation

| Feed | URL | Validate |
|------|-----|----------|
| RSS | https://907.life/feed.xml | validator.w3.org/feed |
| JSON | https://907.life/feed.json | Valid JSON structure |

### 8.6 Performance Check

- PageSpeed Insights: aim for 90+ performance
- WAVE accessibility check: no critical errors

### Completion Checklist

- [ ] Local workflow smooth
- [ ] All pages load correctly
- [ ] Navigation works (including external Photos)
- [ ] Contact form works, email received
- [ ] Site responsive on mobile
- [ ] Feeds valid
- [ ] No major issues
- [ ] All issues fixed and deployed
- [ ] CLAUDE.md accurate and complete

---

## Phase 9: Key Content Creation

**Goal**: Replace placeholder content with real content.

### Tasks

| Task | Details |
|------|---------|
| **9.1 About Page Content** | Write real bio and intro |
| **9.2 Review Sample Posts** | Delete or convert to drafts |
| **9.3 First Real Post** | Create and publish genuine content |
| **9.4 Verify Live Site** | Confirm real content displays |
| **9.5 Final CLAUDE.md Review** | Ensure docs reflect final state |

### 9.1 About Page Content

Replace placeholder with real bio:

```markdown
## About Geoffrey

[2-3 paragraphs: background, interests, Alaska life]

[What this blog covers: adventures, musings, technology, books, music, photos]

---

## Contact {#contact}

I'd love to hear from you. Drop me a message below.
```

### 9.2 Review Sample Posts

| Post | Action |
|------|--------|
| Testing the New Site | Delete or keep as draft |
| Winter in Prior Lake | Delete or repurpose |
| Book Notes | Delete or use as template |
| Favorite Albums | Delete or repurpose |
| Quick Thoughts | Delete |

### 9.3 First Real Post

```bash
# Create your first real post
hugo new posts/$(date +%Y-%m-%d)-your-first-post.md
```

Remove `draft: true` when ready to publish.

### Completion Checklist

- [ ] About page has real bio content
- [ ] Sample posts removed or converted to drafts
- [ ] At least one real post published
- [ ] Live site displays real content
- [ ] CLAUDE.md reflects final state
- [ ] Ready for ongoing blogging!

---

## Quick Reference

### Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:1313 | Hugo dev server |
| http://localhost:8787 | Wrangler dev server (with Worker) |
| https://907.life | Production site |
| https://907-life.{subdomain}.workers.dev | Cloudflare Workers URL |
| https://dash.cloudflare.com | Cloudflare dashboard |
| https://github.com/glw907/907-life | GitHub repo |

### Daily Workflow

```
1. codium ~/Projects/907-life
2. Run Task → "Hugo: Start Server"
3. Create/edit content
4. Preview at localhost:1313
5. Remove draft: true
6. Ctrl+Alt+P → commit message → publish
7. Verify at https://907.life
```

### Common Tags

`alaska` · `musings` · `technology` · `books` · `music` · `photography`
