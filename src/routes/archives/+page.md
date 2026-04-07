<script lang="ts">
  import type { PageData } from './$types';
  import ArchiveList from '$lib/components/ArchiveList.svelte';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Archives — 907.life</title>
</svelte:head>

<div class="archives-page">
  <h1 class="page-title">Archives</h1>

  <section class="archives-tags" aria-label="Tags">
    <h2 class="section-heading">Tags</h2>
    <ul class="post-tags">
      {#each data.tags as { tag, count }}
        <li><a href="/tags/{tag}/" class="post-tag">{tag} ({count})</a></li>
      {/each}
    </ul>
  </section>

  <section class="archives-posts" aria-label="Posts by year">
    <h2 class="section-heading">Posts by Year</h2>
    <ArchiveList posts={data.posts} />
  </section>
</div>

<style>
  .archives-page {
    padding-block-start: 3rem;
  }

  .page-title {
    margin: 0 0 2.5rem;
  }

  .section-heading {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: oklch(58% 0.008 230);
    margin: 0 0 1rem;
  }

  .archives-tags {
    margin-block-end: 2.5rem;
    padding-block-end: 2.5rem;
    border-bottom: 1px solid oklch(90% 0.004 230);
  }

  .archives-posts {
    margin-block-start: 0;
  }
</style>
