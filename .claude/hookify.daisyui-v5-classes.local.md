---
name: daisyui-v5-classes
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(svelte|html)$
  - field: new_text
    operator: regex_match
    pattern: \b(btn-group|input-group|form-control|label-text|label-text-alt|btm-nav|artboard|input-bordered|select-bordered|file-input-bordered|card-bordered|card-compact|tabs-bordered|tabs-lifted|tabs-boxed|textarea-border|footer-center)\b
---

**DaisyUI v4 class name detected. This project uses DaisyUI v5.**

These classes were removed or renamed in DaisyUI v5. They silently do nothing.

| v4 class | v5 replacement |
|---|---|
| `btn-group` | `join` |
| `input-group` | `join` |
| `form-control` | `<fieldset>` element |
| `label-text`, `label-text-alt` | Standard `<label>` markup |
| `btm-nav` | `dock` |
| `input-bordered` | (borders are default; use `-ghost` to remove) |
| `select-bordered` | (same) |
| `textarea-border` | (same) |
| `card-bordered` | `card-border` |
| `card-compact` | `card-sm` |
| `tabs-bordered` | `tabs-border` |
| `tabs-lifted` | `tabs-lift` |
| `tabs-boxed` | `tabs-box` |
| `footer-center` | `footer-horizontal` |

Reference: https://daisyui.com/docs/upgrade/
