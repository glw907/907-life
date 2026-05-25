<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-base-200" data-pagefind-ignore>
  <div class="mx-auto max-w-3xl px-4 py-8">
    {@render children()}
  </div>
</div>
