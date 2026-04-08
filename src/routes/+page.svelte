<script lang="ts">
  import type { PageData } from './$types';
  import { formatDate, postUrl, tagUrl } from '$lib/utils';
  import { HOMEPAGE_FEATURED_COUNT } from '$lib/config';

  let { data }: { data: PageData } = $props();
</script>

<section class="homepage">
  {#if data.featured}
    <article class="featured-post">
      <time class="post-date" datetime={data.featured.date}>{formatDate(data.featured.date)}</time>
      <h2 class="featured-title">
        <a href={postUrl(data.featured)}>{data.featured.title}</a>
      </h2>
      <div class="post-body">
        {@html data.featured.html}
      </div>
      {#if data.featured.tags.length > 0}
        <ul class="post-tags" aria-label="Tags">
          {#each data.featured.tags as tag}
            <li><a href={tagUrl(tag)} class="post-tag">{tag}</a></li>
          {/each}
        </ul>
      {/if}
    </article>
  {/if}

  {#if data.posts.length > HOMEPAGE_FEATURED_COUNT}
    <h3 class="older-heading">Earlier</h3>
    <ol class="post-list" aria-label="Earlier posts">
      {#each data.posts.slice(HOMEPAGE_FEATURED_COUNT) as post}
        <li class="post-entry">
          <div class="post-meta">
            <time class="post-date" datetime={post.date}>{formatDate(post.date)}</time>
            {#if post.tags.length > 0}
              <ul class="post-tags post-tags-inline" aria-label="Tags">
                {#each post.tags as tag}
                  <li><a href={tagUrl(tag)} class="post-tag">{tag}</a></li>
                {/each}
              </ul>
            {/if}
          </div>
          <h2 class="post-title">
            <a href={postUrl(post)}>{post.title}</a>
          </h2>
          {#if post.description}
            <p class="post-description">{post.description}</p>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}
</section>

<style>
  /* ─── Layout ──────────────────────────────────────────────── */
  .homepage {
    padding-block-start: 3rem;
  }

  /* ─── Featured post ──────────────────────────────────────── */
  .featured-post {
    padding-block-end: 3.5rem;
    margin-block-end: 3.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  /* Featured title — the anchor of the page */
  .featured-title {
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 4.5vw, 1.95rem);
    font-weight: 700;
    line-height: 1.18;
    margin: 0 0 1.75rem;
    letter-spacing: -0.02em;
    padding-bottom: 1.75rem;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .featured-title a {
    color: var(--color-heading);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .featured-title a:hover {
    color: var(--color-muted);
  }

  /* ─── Older posts section ─────────────────────────────────── */
  .older-heading {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-muted);
    margin-block-end: 1.75rem;
  }

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .post-entry {
    padding-block: 1.5rem;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .post-entry:first-child { padding-block-start: 0; }
  .post-entry:last-child { border-bottom: none; }

  /* Post list title */
  .post-title {
    font-family: var(--font-display);
    font-size: clamp(1.05rem, 3vw, 1.25rem);
    font-weight: 700;
    line-height: 1.25;
    margin: 0.3rem 0 0;
    letter-spacing: -0.01em;
  }

  .post-title a {
    color: var(--color-heading);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .post-title a:hover {
    color: var(--color-muted);
  }

  .post-meta {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .post-tags-inline {
    margin-block-start: 0;
    gap: 0.1rem 0.5rem;
  }

  /* Description — quieter than the title, italic */
  .post-description {
    font-size: 0.88rem;
    font-style: italic;
    line-height: 1.55;
    color: var(--color-muted);
    margin: 0.35rem 0 0;
  }
</style>
