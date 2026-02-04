# 907.life

Personal blog: Alaska adventures, philosophical musings, technology, books, music, photography, and more.

## Quick Start

```bash
# Clone
git clone https://github.com/glw907/907-life.git
cd 907-life

# Start local server
hugo server -D

# Open http://localhost:1313
```

## Adding Content

```bash
# New post
hugo new posts/$(date +%Y-%m-%d)-your-title/index.md

# Edit and add images to the same directory
content/posts/2025-01-15-your-title/
├── index.md
└── featured.jpg
```

Front matter template:
```yaml
---
title: "Post Title"
date: 2025-01-15
draft: true
tags: ["tag1"]
description: "Brief description"
---
```

Set `draft: false` when ready to publish.

## Project Structure

```
907-life/
├── content/          # Markdown content
├── layouts/          # Template overrides (don't edit themes/)
├── static/           # Unprocessed assets
├── assets/           # Processed assets (CSS, JS)
├── themes/           # Hugo theme (DO NOT edit)
├── hugo.toml         # Site configuration
├── wrangler.toml     # Cloudflare deployment config
└── docs/             # Detailed documentation
```

## Deployment

Push to `master` triggers automatic deployment via GitHub Actions.

```bash
git add <files>
git commit -m "Add new post"
git push origin master
```

Live at https://907.life/ in 1-2 minutes.

See [docs/operations.md](docs/operations.md) for manual deploy and troubleshooting.

## Documentation

| Document | Contents |
|----------|----------|
| [docs/architecture.md](docs/architecture.md) | Theme choice, design decisions |
| [docs/operations.md](docs/operations.md) | Commands, deployment, troubleshooting |

## External Docs

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

## Requirements

- [Hugo](https://gohugo.io/installation/) (extended version)
- [Node.js](https://nodejs.org/) (for Wrangler)

```bash
hugo version    # should show "extended"
node --version
```

---

Live site: https://907.life/

All rights reserved.
