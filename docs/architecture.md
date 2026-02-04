# Architectural Decisions

Key design decisions for the 907.life Hugo site.

---

## Site Design

### Why minimal custom theme?

**Decision:** Build a minimal custom theme rather than use a pre-made theme.

**Rationale:**
- Personal blog with simple requirements
- Full control over design and performance
- No unnecessary features or bloat
- Learning exercise in Hugo theme development
- Easier to maintain and modify

**Implementation:**
- Custom templates in `layouts/_default/`
- Single CSS file (`static/css/styles.css`)
- No JavaScript dependencies (except Turnstile for contact form)

---

## Content Structure

### Why tags only (no categories)?

**Decision:** Use tags as the only taxonomy, disable categories.

**Rationale:**
- Simpler for a personal blog
- Tags are more flexible than hierarchical categories
- Reduces cognitive overhead when writing
- Easier to cross-reference related topics

**Implementation:** `hugo.toml` taxonomies section

### Why page bundles for posts?

**Decision:** Posts use page bundles (`posts/YYYY-MM-DD-slug/index.md`).

**Rationale:**
- Images co-located with content
- Easier to organize and move posts
- Cleaner content directory structure
- Matches Hugo best practices

---

## Contact Form

### Why Cloudflare Worker + Turnstile + Resend?

**Decision:** Implement contact form using Cloudflare Worker for backend, Turnstile for spam protection, Resend for email delivery.

**Rationale:**
- **No backend server needed** - Worker handles form submission
- **Free tier sufficient** - Cloudflare Workers, Turnstile, and Resend all have generous free tiers
- **Spam protection** - Turnstile provides bot detection without CAPTCHA friction
- **Reliable delivery** - Resend specialized in transactional email
- **Fast** - Edge-deployed worker, minimal latency
- **Simple** - Single worker.js file handles everything

**Alternatives considered:**
- *Formspree/Netlify Forms* - Third-party dependency, less control
- *Self-hosted email* - More complexity, deliverability issues
- *Google Forms* - Poor UX, no custom styling

**Implementation:**
- `src/worker.js` - Form handler
- `wrangler.toml` - Routes POST /contact to worker, static assets for everything else
- `layouts/_default/about.html` - Contact form template with Turnstile widget
- Secrets stored in Cloudflare dashboard: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`

**Worker Flow:**
1. User submits form on /contact
2. Worker validates Turnstile token with Cloudflare API
3. If valid, sends email via Resend API
4. Returns JSON response to browser
5. JavaScript displays success/error message

---

## Deployment

### Why Cloudflare Workers (not Pages)?

**Decision:** Deploy via Cloudflare Workers with static assets (not Cloudflare Pages).

**Rationale:**
- **Worker needed for contact form** - Pages doesn't support custom backend logic
- **Single deployment** - Both static site and form handler in one worker
- **Flexible routing** - `run_worker_first` allows worker to intercept specific routes
- **Same performance** - Workers serve static assets just as fast as Pages

**Implementation:**
- Hugo builds to `public/`
- `build.sh` ensures correct Hugo version
- Wrangler deploys worker + static assets
- Worker intercepts POST /contact, serves static files for everything else

---

## Documentation

### Why minimal docs?

**Decision:** Keep documentation minimal - just architecture and operations.

**Rationale:**
- Simple site with straightforward design
- Most patterns are standard Hugo
- Contact form is well-documented in worker.js comments
- Avoid over-documenting simple things

**Implementation:**
- `docs/architecture.md` - This file (design decisions)
- `docs/operations.md` - Dev, deploy, troubleshooting
- `CLAUDE.md` - Quick reference
