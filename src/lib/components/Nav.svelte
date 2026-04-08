<script lang="ts">
  let { onSearchOpen }: { onSearchOpen: () => void } = $props();
</script>

<header class="sticky top-0 z-30 bg-base-100 border-b border-base-200">
  <nav class="container mx-auto px-4 h-14 flex items-center justify-between max-w-3xl">
    <a href="/" class="site-logo">
      <span class="logo-primary">907</span><span class="logo-secondary">.life</span>
    </a>
    <div class="nav-links">
      <a href="/archives" class="nav-link">Archives</a>
      <a href="/about" class="nav-link">About</a>
      <a href="/about#contact" class="nav-link">Contact</a>
      <button
        onclick={onSearchOpen}
        class="nav-icon"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </div>
  </nav>
</header>

<style>
  .site-logo {
    display: flex;
    align-items: baseline;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }
  .site-logo:hover { opacity: 0.7; }

  .logo-primary {
    font-weight: 700;
    font-size: 1.35rem;
    letter-spacing: -0.02em;
    color: var(--color-heading);
  }
  .logo-secondary {
    font-weight: 400;
    font-size: 0.95rem;
    letter-spacing: -0.01em;
    color: var(--color-muted);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-link {
    font-size: 0.75rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.2s ease;
    /* adequate tap target */
    padding-block: 0.4rem;
  }
  .nav-link:hover { color: var(--color-body); }
  .nav-link:active { color: var(--color-heading); }

  .nav-icon {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0.4rem;
    cursor: pointer;
    color: var(--color-muted);
    transition: color 0.2s ease;
  }
  .nav-icon:hover { color: var(--color-body); }
</style>
