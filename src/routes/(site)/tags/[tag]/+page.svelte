<script lang="ts">
  import type { PageData } from './$types';
  import ArchiveList from '$lib/components/ArchiveList.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.tag} — 907.life</title>
  <meta name="description" content={`Posts tagged "${data.tag}".`} />
</svelte:head>

<div class="tag-page">
  <h1 class="page-title">Posts tagged &#8220;{data.tag}&#8221;</h1>
  <ArchiveList posts={data.posts} />
  <footer class="tag-footer">
    <a href="/tags/" class="back-link">← All tags</a>
  </footer>
</div>

<style>
  .tag-page {
    padding-block-start: 3rem;
  }

  .tag-footer {
    margin-block-start: 3rem;
    padding-block-start: 1.75rem;
    border-top: 1px solid var(--color-border-subtle);
  }
</style>
