<script lang="ts">
  let { onSearchOpen }: { onSearchOpen: () => void } = $props();
</script>

<header class="sticky top-0 z-30 bg-base-100 border-b border-base-200">
  <nav class="container mx-auto px-4 h-14 flex items-center justify-between max-w-3xl">
    <a href="/" class="font-semibold text-base hover:opacity-70 transition-opacity">
      907.life
    </a>
    <div class="flex items-center gap-5 text-sm">
      <a href="/archives" class="hover:opacity-70 transition-opacity">Archives</a>
      <a href="/about" class="hover:opacity-70 transition-opacity">About</a>
      <a href="/about#contact" class="hover:opacity-70 transition-opacity">Contact</a>
      <button
        onclick={onSearchOpen}
        class="hover:opacity-70 transition-opacity"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </div>
  </nav>
</header>
