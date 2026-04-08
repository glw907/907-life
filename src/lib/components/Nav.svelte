<script lang="ts">
  import { browser } from '$app/environment';

  let { onSearchOpen }: { onSearchOpen: () => void } = $props();

  let dark = $state(browser && document.documentElement.getAttribute('data-theme') === 'dim');

  function toggleTheme() {
    dark = !dark;
    const theme = dark ? 'dim' : 'silk';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.cookie = `theme=${theme}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
  }
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
      <div class="nav-icons">
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
        <button
          onclick={toggleTheme}
          class="nav-icon"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {#if dark}
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          {/if}
        </button>
      </div>
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
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 1.6rem;
    letter-spacing: -0.025em;
    color: var(--color-heading);
  }
  .logo-secondary {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1rem;
    letter-spacing: 0.04em;
    color: var(--color-muted);
    margin-left: 0.05em;
    position: relative;
    top: -0.04em;
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

  .nav-icons {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>
