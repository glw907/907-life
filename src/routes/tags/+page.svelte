<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Tags — 907.life</title>
  <meta name="description" content="Browse posts by tag." />
</svelte:head>

<div class="tags-page">
  <h1 class="page-title">Tags</h1>
  <ul class="post-tags tags-list" aria-label="All tags">
    {#each data.tags as { tag, count }}
      <li><a href="/tags/{tag}/" class="post-tag">{tag} ({count})</a></li>
    {/each}
  </ul>
</div>

<style>
  .tags-page {
    padding-block-start: 3rem;
  }

  .page-title {
    font-size: clamp(1.55rem, 4.5vw, 1.95rem);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -0.02em;
    color: oklch(18% 0.01 230);
    margin: 0 0 2rem;
  }

  .tags-list {
    margin-block-start: 0;
  }
</style>
