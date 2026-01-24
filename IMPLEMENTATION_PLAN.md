# 907.life Implementation Plan

A phased approach to building a Hugo blog hosted on Cloudflare Pages.

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

### Tasks

| Task | Details |
|------|---------|
| **5.1 Set Up Cloudflare Turnstile** | Create widget, get site key + secret key |
| **5.2 Add Turnstile to Form** | Widget script + div on About page |
| **5.3 Create Pages Function** | functions/contact.js — validate + send email |
| **5.4 Configure Fastmail JMAP** | App Password, account ID |
| **5.5 Add Form Feedback UI** | JavaScript success/error messages |
| **5.6 Document Environment Variables** | Create .env.example |
| **5.7 Local Testing** | Test with Wrangler if possible |
| **5.8 Update CLAUDE.md** | Document form flow, env vars |

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

### 5.3 Pages Function

`functions/contact.js`:

```javascript
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. Parse form data
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const turnstileToken = formData.get('cf-turnstile-response');

    // 2. Validate Turnstile token
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
      return new Response(JSON.stringify({ error: 'Turnstile validation failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Send email via Fastmail JMAP
    // [JMAP implementation here]

    // 4. Return success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

### 5.4 Fastmail Configuration

1. Fastmail → Settings → Privacy & Security → App Passwords
2. Create App Password with JMAP access
3. Note Account ID (from JMAP session endpoint)

Email format:
- From: `907.life Contact <geoff@907.life>`
- Reply-To: Sender's email
- To: `geoff@907.life`
- Subject: `[907.life] {form subject}`
- Body: Plain text

### 5.6 Environment Variables

Create `.env.example`:

```
# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=

# Fastmail JMAP
FASTMAIL_API_TOKEN=
FASTMAIL_ACCOUNT_ID=

# Contact destination
CONTACT_EMAIL=geoff@907.life
```

**Note**: Actual values set in Cloudflare Pages dashboard, NOT in git.

### Completion Checklist

- [ ] Turnstile widget appears on form
- [ ] Pages Function created and handles POST
- [ ] Fastmail JMAP integration working
- [ ] Form submission sends email
- [ ] Email format correct (subject prefix, Reply-To)
- [ ] Success/error feedback displays
- [ ] .env.example documents required vars
- [ ] CLAUDE.md updated

---

## Phase 6: Cloudflare Deployment

**Goal**: Deploy site to Cloudflare Pages with custom domain.

### Tasks

| Task | Details |
|------|---------|
| **6.1 Connect Repo to Cloudflare Pages** | Link GitHub, configure build |
| **6.2 Initial Deployment** | Verify at 907-life.pages.dev |
| **6.3 Configure Environment Variables** | Add secrets in dashboard |
| **6.4 Transfer DNS to Cloudflare** | Move from ClouDNS |
| **6.5 Add Custom Domain** | Connect 907.life to Pages |
| **6.6 Configure www Redirect** | Redirect www → apex |
| **6.7 Verify SSL/HTTPS** | Confirm certificate active |
| **6.8 Test Production** | Full end-to-end test |
| **6.9 Update CLAUDE.md** | Document deployment |

### 6.1 Connect Repository

1. Cloudflare Dashboard → Pages → Create a project
2. Connect to Git → Authorize GitHub → Select `glw907/907-life`
3. Build settings:

| Setting | Value |
|---------|-------|
| Project name | `907-life` |
| Production branch | `main` |
| Build command | `hugo` |
| Build output directory | `public` |
| Environment variable | `HUGO_VERSION` = `0.123.7` |

### 6.3 Environment Variables

Cloudflare Pages → Settings → Environment variables → Production:

| Variable | Type |
|----------|------|
| `TURNSTILE_SECRET_KEY` | Encrypted |
| `FASTMAIL_API_TOKEN` | Encrypted |
| `FASTMAIL_ACCOUNT_ID` | Encrypted |
| `CONTACT_EMAIL` | Plain text |

### 6.4 Transfer DNS to Cloudflare

1. Cloudflare Dashboard → Add a site → `907.life` → Free plan
2. Cloudflare provides nameservers (e.g., `anna.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
3. At ClouDNS: Update nameservers to Cloudflare's
4. Wait for propagation (minutes to hours)
5. Cloudflare dashboard shows domain as "Active"

### 6.5 Add Custom Domain

1. Pages → 907-life → Custom domains → Set up a custom domain
2. Add `907.life`
3. Cloudflare auto-configures DNS (since DNS is now on Cloudflare)

### 6.6 Configure www Redirect

Cloudflare Dashboard → Rules → Redirect Rules:

- If: Hostname equals `www.907.life`
- Then: Redirect to `https://907.life` (301 Permanent)

### Completion Checklist

- [ ] Site deploys on push to main
- [ ] https://907-life.pages.dev works
- [ ] Environment variables configured
- [ ] DNS transferred to Cloudflare
- [ ] https://907.life works with valid SSL
- [ ] www.907.life redirects to 907.life
- [ ] HTTP redirects to HTTPS
- [ ] Contact form works in production
- [ ] CLAUDE.md updated

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
| http://localhost:1313 | Local dev server |
| https://907.life | Production site |
| https://907-life.pages.dev | Cloudflare Pages URL |
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
