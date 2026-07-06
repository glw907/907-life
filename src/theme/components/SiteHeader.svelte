<!-- @component
907's public site header: an owned, copy-in chrome component on the Waymark token layer (see
theme.css). A sticky band over a translucent `base-100` with a hairline bottom, carrying the
wordmark on the left and the primary nav (read from site.config.yaml's `primary` menu, so the
`/admin/nav` editor stays the one place that manages it), the search trigger, and the theme toggle
on the right. Every colour reads a DaisyUI role utility or a cairn token, never a literal; the
wordmark (Wordmark.svelte) and the nav link's size/tracking are the two exceptions, carrying the
site's original type-audit numbers verbatim since no step in the fluid type scale matches them.
The current route's nav link gets `aria-current="page"` and the accent colour. The inner content
caps at `--container-measure`, the same width as the article and home reading column (`.site-main`),
so the wordmark's left edge lines up with the body copy below it. The layout is no-JS-first
responsive: the wordmark carries `white-space: nowrap` so it can only wrap the row, not its letters;
the nav, the search trigger, and the toggle share one wrapping flex group, so that group (not each
control individually) drops to its own full-width line below the wordmark once it no longer fits
beside it, then wraps further internally if it still overflows. Nav links and the two icon buttons
all carry a 44px-class touch target so a wrapped row stays tappable on a phone.

The theme toggle now consumes the chassis's shared mechanism (`$chassis/theme-toggle`) rather than
carrying its own copy: it sets `data-theme` on `<html>` between `cairn` (light) and `cairn-dark`,
persisted to a `cairn-site-theme` cookie the no-flash inline script in `app.html` reads before first
paint. With no stored choice, `data-theme` stays unset and `theme.css`/`907-theme.css`'s own
`prefers-color-scheme` blocks pick the system scheme live, with no JS at all.
-->
<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { extractMenu } from '@glw907/cairn-cms';
  import { resolveTheme, toggleTheme as chassisToggleTheme, type ThemeToggleConfig } from '$chassis/theme-toggle.js';
  import { siteConfig } from '$theme/cairn.config';
  import SearchModal from './SearchModal.svelte';
  import Wordmark from './Wordmark.svelte';

  const nav = extractMenu(siteConfig, 'primary', 2);

  /**
   * Whether a nav item points at the page being viewed. The home link matches only the exact root;
   * a deeper link matches its own path or anything nested under it (and strips a `#fragment`
   * before comparing, since the Contact entry links `/about#contact`).
   */
  function isCurrent(href: string): boolean {
    const target = href.split('#')[0];
    const path = page.url.pathname;
    if (target === '/') return path === '/';
    return path === target || path.startsWith(`${target}/`);
  }

  /** The two explicit theme choices; `theme.css` defines both as named DaisyUI themes. */
  type Theme = 'cairn' | 'cairn-dark';

  /** 907's own names and cookie, fed to the chassis toggle mechanism below. */
  const themeConfig: ThemeToggleConfig<Theme> = { light: 'cairn', dark: 'cairn-dark', cookieName: 'cairn-site-theme' };

  // The icon is correct on first paint even before any explicit choice exists (resolveTheme reads
  // `<html>`'s live data-theme, set by the head script, or falls back to the system scheme). Never
  // called during SSR (`browser` guards every call site), so `document`/`window` are always safe.
  let theme = $state<Theme>(browser ? resolveTheme(themeConfig) : 'cairn');

  /** Flips the explicit theme via the chassis mechanism, which also persists the choice. */
  function toggleTheme() {
    theme = chassisToggleTheme(themeConfig, theme);
  }
</script>

<header class="site-header sticky top-0 z-20 border-b border-card-border">
  <div class="mx-auto flex max-w-measure flex-wrap items-center justify-between gap-m px-m py-xs">
    <Wordmark />

    <div class="flex flex-wrap items-center gap-s">
      <nav class="site-nav flex flex-wrap items-center gap-s" aria-label="Primary">
        {#each nav as item (item.url ?? item.label)}
          {@const current = item.url ? isCurrent(item.url) : false}
          <a
            href={item.url}
            aria-current={current ? 'page' : undefined}
            class="inline-flex min-h-11 items-center px-xs no-underline {current
              ? 'font-semibold text-primary'
              : 'font-medium text-muted hover:text-base-content'}"
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <SearchModal />

      <button
        type="button"
        onclick={toggleTheme}
        aria-label={theme === 'cairn-dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        class="theme-toggle inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-field text-muted hover:text-base-content"
      >
        {#if theme === 'cairn-dark'}
          <!-- Sun: shown while dark is active, click to switch to light. -->
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 3v2M12 19v2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M3 12h2M19 12h2M5.64 18.36l1.42-1.42M16.94 7.06l1.42-1.42"
            />
          </svg>
        {:else}
          <!-- Moon: shown while light is active, click to switch to dark. -->
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.4 14.9A8.5 8.5 0 1 1 9.6 4.1a7 7 0 0 0 10.8 10.8z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</header>

<style>
  /* The translucent band reads a color-mix a Tailwind utility cannot express cleanly. Scoped to
     this component; the consistent focus ring matches the rest of the chrome. */
  .site-header {
    background: color-mix(in oklab, var(--color-base-100) 88%, transparent);
    backdrop-filter: saturate(1.4) blur(8px);
  }
  /* The old nav idiom: a small uppercase eyebrow label, not the fluid type scale (no step matches
     0.75rem). */
  .site-nav a {
    font-size: 0.75rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: color 0.15s;
  }
  .site-nav a:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  .theme-toggle {
    transition: color 0.15s;
  }
  .theme-toggle:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .site-nav a,
    .theme-toggle {
      transition: none;
    }
  }
</style>
