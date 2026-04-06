<script lang="ts">
  import ArchiveList from '$lib/components/ArchiveList.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>Archives — 907.life</title>
</svelte:head>

<div class="archives-page">
  <h1 class="page-title">Archives</h1>
  <ArchiveList posts={data.posts} />
</div>

<style>
  .archives-page {
    padding-block-start: 3rem;
  }

  .page-title {
    font-size: clamp(1.55rem, 4.5vw, 1.95rem);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -0.02em;
    color: oklch(18% 0.01 230);
    margin: 0;
  }
</style>
