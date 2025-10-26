# 907.life - Hugo Static Site

A Hugo-based website documenting the practical realities of living without a smartphone — what works, what doesn't, and how to navigate common obstacles.

## Overview

This site is built with Hugo v0.152.2 and deployed via Netlify. It features:

- Clean, readable typography (humanist text with neo-grotesque headings)
- Light/dark mode support
- Tag-based content organization
- RSS and JSON feeds
- Responsive design
- Font Awesome icons

## Core Principles

All content and design decisions align with four principles:

1. **Intentionality** - Deliberate choices over defaults
2. **Accessibility** - Clear, readable content
3. **Honesty** - Personal experience grounds all claims
4. **Focus** - Respect for reader attention

## Content Architecture

### Taxonomy System

**Tags** (content types):
- `also` - Personal writing separate from main content
- `reviews` - Device and tool evaluations
- `guides` - How-to and practical content

**Categories** (topics):
- `dumbphones`, `companion-devices`, `auxiliary-devices`, `analog-tools`, `software`
- `parenting`, `philosophy`, `research`, `social-friction`, `success-stories`, `workarounds`

### Front Matter Example

```yaml
---
title: "Managing School Communication Without a Smartphone"
date: 2025-10-25
tags:
  - guides
categories:
  - parenting
  - workarounds
---
```

## Local Development

### Prerequisites

- Hugo v0.152.2 or later
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/glw907/907-life.git
cd 907-life
```

2. Run the Hugo development server:
```bash
hugo server -D
```

3. Open your browser to `http://localhost:1313`

### Build for Production

```bash
hugo --gc --minify
```

The site will be built to the `public/` directory.

## Project Structure

```
907-life/
├── archetypes/          # Content templates
├── content/            # Markdown content files
├── layouts/            # Hugo templates
│   ├── _default/       # Base templates (baseof, single, list)
│   ├── also/           # "Also" section templates
│   ├── guides/         # Guides section templates
│   ├── reviews/        # Reviews section templates
│   └── partials/       # Reusable template components
├── static/
│   └── css/
│       ├── main.css    # Tiny theme base CSS
│       └── custom.css  # Custom overrides and extensions
├── hugo.toml           # Hugo configuration
├── netlify.toml        # Netlify deployment config
└── README.md           # This file
```

## Deployment

The site automatically deploys to Netlify when changes are pushed to the main branch.

**Netlify Configuration:**
- Build command: `hugo --gc --minify`
- Publish directory: `public`
- Hugo version: 0.152.2

## CSS Architecture

### Cascade

1. **main.css** (Tiny theme base)
   - CSS variables for colors and fonts
   - Base typography and layout
   - 14 font stack options

2. **custom.css** (907.life customizations)
   - Typography overrides (Classical Humanist + Neo-grotesque)
   - Warm cream background with dark text
   - Custom heading hierarchy
   - Enhanced list styling with en dash bullets
   - Icon integration with Font Awesome

### Key Features

- Root font size: 16px (17px on wider screens)
- Body line-height: 1.6 for readability
- Heading weights: 550-650 (mid-heavy range)
- Strong/bold: 550 weight (visible but not harsh)
- H4: Small caps with bottom rule for paragraph labels

## Writing Content

### Creating a New Post

```bash
hugo new content/posts/my-post-title.md
```

Edit the front matter to include appropriate tags and categories.

### Using the <!--more--> Tag

Add `<!--more-->` in your post to create an excerpt:

```markdown
This is the summary that appears on list pages.

<!--more-->

This is the full content that only appears on the post page.
```

### Markdown Basics

- Use `# Heading` for post title (H1)
- Use `## Heading` for main sections (H2)
- Use `### Heading` for subsections (H3)
- Use `#### Heading` for paragraph labels (H4, renders with small caps)
- Use `**bold**` for emphasis
- Use `*italic*` for gentle emphasis

## Content Types

### Reviews

Reviews must be tagged with `reviews` AND a device category:

```yaml
tags:
  - reviews
categories:
  - dumbphones
```

### Guides

Guides must be tagged with `guides` AND a topic category:

```yaml
tags:
  - guides
categories:
  - parenting
```

### Also (Personal Content)

Personal writing uses only the `also` tag:

```yaml
tags:
  - also
categories:
  - alaska-adventures
```

## Site Sections

- **Welcome** (`/welcome/`) - Introduction and philosophy
- **Guides** (`/guides/`) - Practical how-to content
- **Reviews** (`/reviews/`) - Device and tool evaluations
- **Archive** (`/archive/`) - Complete chronological listing
- **About** (`/about/`) - Site information
- **Also** (`/also/`) - Personal writing

## Contributing

This is a multi-author site. For contributor guidelines, see the new author guide.

## Technical Details

- **Static Site Generator:** Hugo v0.152.2
- **Hosting:** Netlify
- **Version Control:** Git + GitHub
- **Base Theme:** Custom (adapted from Micro.blog Tiny theme)
- **Icons:** Font Awesome 6.4.0
- **Markup:** CommonMark (Goldmark renderer)

## License

Content © Geoff Wright and contributors. All rights reserved.

## Contact

- **Email:** geoff@907.life
- **Phone:** 907-277-9397 (home)
- **Mobile:** 907-317-8472 (off evenings and weekends)

---

**Last Updated:** 2025-10-25
