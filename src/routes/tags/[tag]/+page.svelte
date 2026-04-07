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

  .page-title {
    font-size: clamp(1.55rem, 4.5vw, 1.95rem);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -0.02em;
    color: oklch(18% 0.01 230);
    margin: 0 0 2rem;
  }

  .tag-footer {
    margin-block-start: 3rem;
    padding-block-start: 1.75rem;
    border-top: 1px solid oklch(88% 0.005 230);
  }

  .back-link {
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    color: oklch(52% 0.008 230);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: oklch(28% 0.01 230);
  }
</style>
