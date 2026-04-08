<script lang="ts">
  import type { PageData } from './$types';
  import { formatDate, tagUrl } from '$lib/utils';
  import { SITE_TITLE } from '$lib/config';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.post.title} — {SITE_TITLE}</title>
  {#if data.post.description}
    <meta name="description" content={data.post.description} />
  {/if}
</svelte:head>

<article class="post-detail">
  <header class="post-header">
    <time class="post-date" datetime={data.post.date}>{formatDate(data.post.date)}</time>
    <h1 class="post-title">{data.post.title}</h1>
  </header>

  <div class="post-body">
    {@html data.post.html}
  </div>

  {#if data.post.tags.length > 0}
    <ul class="post-tags" aria-label="Tags">
      {#each data.post.tags as tag}
        <li><a href={tagUrl(tag)} class="post-tag">{tag}</a></li>
      {/each}
    </ul>
  {/if}

  <footer class="post-footer">
    <a href="/" class="back-link">← All posts</a>
  </footer>
</article>

<style>
  .post-detail {
    padding-block-start: 3rem;
  }

  .post-header {
    padding-block-end: 1.75rem;
    border-bottom: 1px solid var(--color-border-subtle);
    margin-block-end: 1.75rem;
  }

  .post-title {
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 4.5vw, 1.95rem);
    font-weight: 700;
    line-height: 1.18;
    margin: 0.65rem 0 0;
    letter-spacing: -0.02em;
    color: var(--color-heading);
  }

  .post-footer {
    margin-block-start: 3.5rem;
    padding-block-start: 1.75rem;
    border-top: 1px solid var(--color-border-subtle);
  }

</style>
