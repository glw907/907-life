<script lang="ts">
  import type { PageData } from './$types';
  import ArchiveList from '$lib/components/ArchiveList.svelte';
  import { tagUrl } from '$lib/utils';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Archives — 907.life</title>
</svelte:head>

<div class="archives-page">
  <h1 class="page-title">Archives</h1>

  <section class="archives-tags" aria-label="Tags">
    <h2 class="section-heading">Tags</h2>
    <ul class="tags-list" aria-label="All tags">
      {#each data.tags as { tag, count }}
        <li>
          <a href={tagUrl(tag)} class="tag-entry">
            <span class="tag-name">{tag}</span>
            <span class="tag-count">{count}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <section class="archives-posts" aria-label="Posts by year">
    <h2 class="section-heading">Posts</h2>
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
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-heading);
    margin: 0 0 1.25rem;
    padding-block-end: 0.5rem;
    border-bottom: 1.5px solid var(--color-border);
  }

  .archives-tags {
    margin-block-end: 3.5rem;
  }

  .tags-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 1.25rem;
  }

  .tag-entry {
    font-family: var(--font-display);
    font-size: 0.92rem;
    font-weight: 400;
    color: var(--color-tag);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .tag-entry:hover {
    color: var(--color-heading);
  }

  .tag-count {
    font-size: 0.65em;
    font-weight: 400;
    color: var(--color-muted);
    vertical-align: super;
    margin-inline-start: 0.1em;
  }

  .archives-posts {
    margin-block-start: 0;
  }
</style>
