<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import SearchModal from '$lib/components/SearchModal.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { SITE_TITLE } from '$lib/config';

  let { children } = $props();
  let searchOpen = $state(false);
</script>

<svelte:head>
  <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
  <link rel="alternate" type="application/feed+json" title={SITE_TITLE} href="/feed.json" />
</svelte:head>

<Nav onSearchOpen={() => { searchOpen = true; }} />
<SearchModal bind:open={searchOpen} />

<main class="container mx-auto px-4 max-w-3xl py-8">
  {@render children()}
</main>

<footer class="container mx-auto px-4 max-w-3xl py-8 mt-8 border-t border-base-200 text-center">
  <div class="footer-links">
    <a href="/feed.xml" aria-label="RSS feed" class="footer-icon-link">
      <Icon label="RSS feed">
        {#snippet children()}
          <path d="M4 11a9 9 0 0 1 9 9"/>
          <path d="M4 4a16 16 0 0 1 16 16"/>
          <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/>
        {/snippet}
      </Icon>
      <span class="footer-label">rss</span>
    </a>
    <a href="/feed.json" aria-label="JSON feed" class="footer-icon-link">
      <Icon label="JSON feed">
        {#snippet children()}
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        {/snippet}
      </Icon>
      <span class="footer-label">json</span>
    </a>
    <a href="/about#contact" aria-label="Contact" class="footer-icon-link">
      <Icon label="Contact">
        {#snippet children()}
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        {/snippet}
      </Icon>
      <span class="footer-label">email</span>
    </a>
  </div>
  <p class="footer-name">{SITE_TITLE}</p>
</footer>

<style>
  .footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-block-end: 0.75rem;
  }

  .footer-icon-link :global(svg) {
    width: 18px;
    height: 18px;
  }

  .footer-icon-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-label {
    font-family: var(--font-display);
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    text-transform: lowercase;
  }

  .footer-icon-link:hover {
    color: var(--color-body);
  }

  .footer-name {
    font-size: 0.75rem;
    color: var(--color-muted);
    margin: 0;
  }
</style>
