# Iconography

## Overview

907.life uses [Phosphor Icons](https://phosphoricons.com/) (Regular weight) rendered as self-hosted inline SVG. No CDN, no external requests, no JavaScript icon library.

**Why Phosphor Regular:**
- Lighter, more refined appearance than Font Awesome Solid
- MIT licensed — safe for self-hosting
- Fill-based Regular weight works cleanly at small nav sizes

---

## Icon Inventory

| Location | Icon | Partial param |
|----------|------|---------------|
| Nav: Home | House | `"House"` |
| Nav: Photos | Camera | `"Camera"` |
| Nav: Archives | Archive box | `"Archive"` |
| Nav: Search | Magnifying glass | `"MagnifyingGlass"` |
| Nav: About | User silhouette | `"User"` |
| Post meta: date | Calendar | `"Calendar"` |

### Tag Icons

Tag icons are rendered via `layouts/partials/icons/tag-icon.html`. The partial takes the tag slug as its root context (`.`) and returns an SVG with classes `ph-icon ph-tag-icon`, or nothing for unmapped tags.

| Tag slug | Phosphor icon | Rationale |
|----------|---------------|-----------|
| `alaska` | Mountains | Immediate Alaska association |
| `books` | Books | Direct match |
| `music` | MusicNotes | More evocative than single note |
| `musings` | Feather | Quill pen — reflective, thoughtful writing |
| `photography` | Aperture | Distinct from nav's Camera |
| `technology` | Terminal | Clear tech/code identity |
| *(other)* | *(none)* | Unmapped tags render no icon — graceful fallback |

**Visual distinction from nav icons:** Nav icons use `fill: currentColor` at 50% opacity (gray). Tag icons add `color: var(--color-link)` (blue in light mode, light-blue in dark) at 85% opacity. No nav icon is colored; no tag icon is gray.

**Where tag icons appear:**
- Single post footer: inside each tag pill `<a>`
- Archives page tag list: inside each tag link `<a>`

**Excluded:** Archives `<h2>Tags</h2>` heading and `/tags/` taxonomy terms page.

---

## How Icons Are Rendered

Icons are dispatched through `layouts/partials/icons/phosphor.html`. Call it with a name dict:

```html
{{ partial "icons/phosphor.html" (dict "name" "House") }}
```

The partial outputs a self-contained `<svg class="ph-icon" aria-hidden="true">` element with the path data inline. No external file loads.

SVG paths are sourced from the [phosphor-icons/core](https://github.com/phosphor-icons/core) repository, `assets/regular/` directory (256×256 viewBox, MIT license).

---

## CSS

Icons are styled via `.ph-icon` in `assets/css/extended/custom.css`:

```css
.ph-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  margin-right: 0.35em;
  opacity: 0.6;
  fill: currentColor;  /* Phosphor Regular uses fill, not stroke */
}

nav .ph-icon {
  font-size: 0.8em;
  opacity: 0.5;
}
```

Dark mode opacity is reduced slightly via `:root[data-theme="dark"] .ph-icon`.

---

## Adding a New Icon

1. Find the icon at [phosphoricons.com](https://phosphoricons.com/), select **Regular** weight
2. Get the raw SVG path from the [phosphor-icons/core repo](https://github.com/phosphor-icons/core/tree/main/assets/regular)
3. Add a new `{{- if eq .name "IconName" -}}` block to `layouts/partials/icons/phosphor.html`:

```html
{{- if eq .name "IconName" -}}<svg class="ph-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="...path data..."/></svg>
{{- end -}}
```

4. Call via `{{ partial "icons/phosphor.html" (dict "name" "IconName") }}`
5. Update the COUPLING MANIFEST in `assets/css/extended/custom.css` if adding new CSS selectors

---

## Placement

**Nav icons** are injected in `layouts/partials/header.html` (PaperMod override), matching menu item names:

```html
{{- if eq .Name "Home" }}{{- partial "icons/phosphor.html" (dict "name" "House") }}{{- end -}}
```

**Post date icon** is prepended in `layouts/partials/post_meta.html` (PaperMod override):

```go
{{- $icon := partial "icons/phosphor.html" (dict "name" "Calendar") }}
{{- $scratch.Add "meta" (slice (printf "%s<span ...>%s</span>" $icon ...)) }}
```
