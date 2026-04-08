<script lang="ts">
  import type { PostSummary } from '$lib/types';
  import { formatShortDate, postUrl } from '$lib/utils';

  let { posts }: { posts: PostSummary[] } = $props();

  const byYear = $derived(
    posts.reduce<Record<string, PostSummary[]>>((acc, post) => {
      (acc[post.year] ??= []).push(post);
      return acc;
    }, {})
  );

  const years = $derived(Object.keys(byYear).sort((a, b) => Number(b) - Number(a)));
</script>

<div class="archive">
  {#each years as year}
    <section class="archive-year">
      <h2 class="year-heading">{year}</h2>
      <ol class="year-list">
        {#each byYear[year] as post}
          <li class="archive-entry">
            <time class="entry-date" datetime={post.date}>{formatShortDate(post.date)}</time>
            <a class="entry-title" href={postUrl(post)}>
              {post.title}
            </a>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</div>

<style>
  .archive {
    margin-block-start: 2.5rem;
  }

  .archive-year + .archive-year {
    margin-block-start: 2.5rem;
  }

  .year-heading {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-muted);
    margin-block-end: 1rem;
  }

  .year-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .archive-entry {
    display: flex;
    align-items: baseline;
    gap: 1.25rem;
    padding-block: 0.6rem;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .archive-entry:last-child {
    border-bottom: none;
  }

  .entry-date {
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    color: var(--color-muted);
    white-space: nowrap;
    width: 4.5rem;
    flex-shrink: 0;
  }

  .entry-title {
    font-size: 0.975rem;
    color: var(--color-heading);
    text-decoration: none;
    transition: color 0.15s ease;
    line-height: 1.4;
  }

  .entry-title:hover {
    color: var(--color-muted);
  }
</style>
