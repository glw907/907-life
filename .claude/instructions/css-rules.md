# CSS Authoring Rules (`assets/css/extended/custom.css`)

AI-facing rules for writing custom CSS in a Hugo/PaperMod site. Enforced by the PreToolUse hook in
`.claude/hooks/check-css-important.sh`.

---

## Rule 1: Never use `!important`

`custom.css` loads **after** the theme's compiled CSS. Equal-specificity rules win by load
order — your rules win without `!important`.

### How to win the cascade without `!important`

| Situation | Fix |
|-----------|-----|
| Fighting a component class | Prefix selector with the component's container element |
| Fighting a layout/nav rule | Prefix with the section element (`header`, `nav`, `footer`) |
| Fighting a dark-mode rule | Match the theme's dark-mode selector depth (e.g., `.dark .my-class`) |
| Fighting a mobile media query | Place mobile overrides inside `@media (max-width: ...)` after desktop rules |
| Fighting a utility class | Add one more class or element to increase specificity |

### Only valid exception

Third-party embedded widgets (e.g., payment forms, membership tools) that inject inline
`style=` attributes. These require `!important` because inline styles have the highest
specificity.

**When used:** Add `/* C: vendor */` comment on the same line.

```css
/* WRONG */
.my-class { color: blue !important; }

/* RIGHT — cascade wins by load order */
.my-class { color: blue; }

/* ALSO RIGHT — increased specificity */
section .my-class { color: blue; }

/* LEGITIMATE EXCEPTION */
.embed-container a { color: inherit !important; } /* C: vendor */
```

---

## Rule 2: Use theme CSS variables for colors — never hardcode values

Find your theme's variable/scheme file and use its tokens. Pattern:
`rgba(var(--color-xxx), opacity)` or `var(--color-xxx)` depending on the theme's format.

**For colors that have no theme equivalent:**

Define a custom property in the `:root` block at the top of `custom.css`, then reference
it everywhere via the variable. Never hardcode `rgb()`/`rgba()`/`#hex` values directly
in rules — a hardcoded value is untraceable and breaks dark mode pairing.

```css
/* WRONG */
.banner { background: rgb(23, 23, 23); }

/* RIGHT — define token once, use everywhere */
:root {
  --color-dark-overlay: 23, 23, 23;
}
.banner { background: rgba(var(--color-dark-overlay), 0.9); }
```

**Bare `R, G, B` triplet convention** (compatible with Blowfish and similar themes):
Store values as `R, G, B` (no `rgb()` wrapper) so they can be composed with opacity via
`rgba(var(--my-token), 0.5)`.

---

## Rule 3: Maintain the theme coupling manifest

The comment block near the top of `custom.css` (labeled "COUPLING MANIFEST") lists all
selectors that target the theme's compiled/generated class names.

**When adding a selector that targets a theme-generated class:**
1. Add it to the manifest comment block
2. Note which theme template or partial it depends on

**After every theme submodule update:** Spot-check all manifest entries in DevTools.
Compiled theme classes can change between versions. The manifest is the checklist.

---

## Rule 4: Tag every new section

Use the standard section header pattern so the file stays navigable:

```css
/* ============================================
   SECTION NAME
   ============================================ */
```

---

## Rule 5: No `style=` in template files

All layout CSS goes in `assets/css/extended/custom.css`. Template files under `layouts/` must not
have `style=` attributes.

**Only valid exception:** `style="display:none"` where JavaScript controls visibility at
runtime. Mark with a comment explaining which JS function toggles it.
