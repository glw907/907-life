<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import SearchModal from '$lib/components/SearchModal.svelte';

  let { children } = $props();
  let searchOpen = $state(false);
</script>

<Nav onSearchOpen={() => { searchOpen = true; }} />
<SearchModal bind:open={searchOpen} />

<main class="container mx-auto px-4 max-w-3xl py-8">
  {@render children()}
</main>

<footer class="container mx-auto px-4 max-w-3xl py-8 mt-8 border-t border-base-200 text-sm text-base-content/60 text-center">
  907.life
</footer>
