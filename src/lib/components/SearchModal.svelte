<script lang="ts">
  import { onMount } from 'svelte';

  let { open = $bindable(false) }: { open: boolean } = $props();

  let initialized = false;

  onMount(async () => {
    if (initialized) return;
    try {
      // @ts-ignore — pagefind assets generated at build time, not present in dev
      const { PagefindUI } = await import('/pagefind/pagefind-ui.js');
      new PagefindUI({ element: '#pagefind-search', showSubResults: true });
      initialized = true;
    } catch {
      // dev mode — pagefind not built yet
    }
  });

  function close() {
    open = false;
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
    role="presentation"
    onclick={(e) => { if (e.target === e.currentTarget) close(); }}>
    <div class="bg-base-100 rounded-box shadow-2xl w-full max-w-2xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-lg">Search</h2>
        <button onclick={close} class="btn btn-ghost btn-sm btn-circle" aria-label="Close">✕</button>
      </div>
      <div id="pagefind-search"></div>
      <link rel="stylesheet" href="/pagefind/pagefind-ui.css" />
    </div>
  </div>
{/if}
