<!-- @component
One dated post row: the date, the linked title, and its tags, each tag linking to `/tags/<tag>/`.
Shared by the `/archives` full listing and a `/tags/[tag]` detail page, both plain dated lists (the
home page keeps its own bespoke markup, since it also carries a lead treatment and the tag filter
this row does not need). -->
<script lang="ts">
  import type { ContentSummary } from '@glw907/cairn-cms/delivery';
  import { formatDate } from '$lib/format-date';

  let {
    post,
    labels,
  }: {
    post: ContentSummary;
    /** Tag value to its curated display label; a tag missing from the map falls back to its raw value. */
    labels: Record<string, string>;
  } = $props();
</script>

<article class="row" class:row--undated={!post.date}>
  {#if post.date}
    <div class="row__date">{formatDate(post.date)}</div>
  {/if}
  <div class="row__body">
    <h3 class="row__title"><a href={post.permalink}>{post.title}</a></h3>
    {#if post.tags.length > 0}
      <p class="row__tags">
        {#each post.tags as tag (tag)}
          <a href="/tags/{tag}/" class="row__tag">{labels[tag] ?? tag}</a>
        {/each}
      </p>
    {/if}
  </div>
</article>

<style>
  .row {
    display: grid;
    grid-template-columns: 9rem 1fr;
    gap: var(--spacing-m);
    align-items: start;
    padding: var(--spacing-s) 0;
    border-bottom: var(--border) solid var(--color-card-border);
  }
  .row--undated {
    grid-template-columns: 1fr;
  }

  /* The old date-stamp idiom: a quiet uppercase letterspaced label, not the fluid type scale (no
     step matches 0.72rem). */
  .row__date {
    padding-top: 0.35rem;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-muted);
  }

  .row__title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: var(--text-step-1);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
  }
  .row__title a {
    color: inherit;
    text-decoration: none;
  }
  .row__title a:hover {
    color: var(--color-primary);
  }

  .row__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 0.3rem 0 0;
  }
  /* The old archive-tag idiom: a hash-prefixed label on the display face (Karla), fainter than the
     label itself, not a bordered chip (that treatment belongs to the post page's tag pills). */
  .row__tag {
    font-family: var(--font-display);
    font-size: 0.68rem;
    color: var(--color-muted);
    text-decoration: none;
  }
  .row__tag::before {
    content: '#';
    color: color-mix(in oklab, var(--color-muted) 65%, transparent);
    margin-inline-end: 0.06em;
  }
  .row__tag:hover {
    color: var(--color-base-content);
  }

  @media (max-width: 34rem) {
    .row {
      grid-template-columns: 1fr;
      gap: 0.3rem;
    }
    .row__date {
      padding-top: 0;
    }
  }
</style>
