<script lang="ts">
  import type { PageData } from './$types';
  import { tagUrl } from '$lib/utils';

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
      <li><a href={tagUrl(tag)} class="post-tag">{tag} ({count})</a></li>
    {/each}
  </ul>
</div>

<style>
  .tags-page {
    padding-block-start: 3rem;
  }

  .tags-list {
    margin-block-start: 0;
  }
</style>
