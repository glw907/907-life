<!-- @component
907's public site footer: an owned, copy-in chrome component on the Waymark token layer. It sits on
`base-200` over a top hairline and carries the wordmark, a footer nav (the feeds plus the admin
link), and a fine-print line. Every colour reads a DaisyUI role utility or a cairn token.
The inner content caps at `--container-measure`, matching the header and the article/home reading
column, so the footer's left edge lines up with the body copy above it.
The Feed/JSON Feed/Admin labels carry the site's original lowercase, letterspaced label treatment
(Karla, not the fluid type scale), the same device the old footer's icon-link labels used.
-->
<script lang="ts">
  import Wordmark from './Wordmark.svelte';

  /** A footer-nav entry: the visible label and the path it links to. */
  type NavItem = { label: string; href: string };

  const nav: NavItem[] = [
    { label: 'Feed', href: '/feed.xml' },
    { label: 'JSON Feed', href: '/feed.json' },
    { label: 'Admin', href: '/admin' },
  ];
</script>

<footer class="site-footer mt-2xl border-t border-base-300 bg-base-200">
  <div class="mx-auto flex max-w-measure flex-wrap items-center justify-between gap-m px-m py-xl">
    <Wordmark />

    <nav class="site-nav flex flex-wrap items-center gap-s" aria-label="Footer">
      {#each nav as item (item.href)}
        <a href={item.href} class="inline-flex min-h-11 items-center text-muted no-underline hover:text-base-content">
          {item.label}
        </a>
      {/each}
    </nav>

    <p class="w-full border-t border-card-border pt-s text-step--1 text-muted">
      A personal blog by Geoffrey L. Wright, from Alaska. Built with cairn.
    </p>
  </div>
</footer>

<style>
  /* The old footer label idiom: lowercase, letterspaced, on the display face, not the fluid type
     scale (no step matches 0.8rem). */
  .site-nav a {
    font-family: var(--font-display);
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    text-transform: lowercase;
    border-radius: 2px;
    transition: color 0.15s;
  }
  .site-nav a:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .site-nav a {
      transition: none;
    }
  }
</style>
