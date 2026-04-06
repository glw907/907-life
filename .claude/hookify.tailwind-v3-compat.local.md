---
name: tailwind-v3-compat
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|html)$
  - field: new_text
    operator: regex_match
    pattern: \b(bg-opacity-|text-opacity-|border-opacity-|flex-shrink-|flex-grow-|overflow-ellipsis)\S*|\b(shadow-sm|blur-sm|rounded-sm|outline-none)\b
---

**Tailwind v3 utility detected. This project uses Tailwind CSS v4.**

**Removed utilities** (silently do nothing in v4):

| v3 | v4 replacement |
|---|---|
| `bg-opacity-50` | `bg-black/50` (slash opacity syntax) |
| `text-opacity-75` | `text-black/75` |
| `border-opacity-25` | `border-black/25` |
| `flex-shrink-0` | `shrink-0` |
| `flex-grow` | `grow` |
| `overflow-ellipsis` | `text-ellipsis` |

**Renamed utilities** (apply wrong values in v4):

| v3 | v4 | Effect |
|---|---|---|
| `shadow-sm` | `shadow-xs` | Wrong shadow size |
| `blur-sm` | `blur-xs` | Wrong blur |
| `rounded-sm` | `rounded-xs` | Wrong radius |
| `outline-none` | `outline-hidden` | Breaks forced-colors accessibility mode |

Also note: a bare `border` class with no `border-{color}` class defaults to `currentColor` in v4 (was gray-200 in v3) — may render invisible.
