<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function formatDate(iso: string): string {
    // Parse as UTC to avoid timezone-shift on YYYY-MM-DD strings
    const [year, month, day] = iso.split('T')[0].split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }
</script>

<section class="homepage">
  <header class="lede">
    <p>Notes from Anchorage — on seasons, music, books, and whatever else insists on being written down.</p>
  </header>

  <ol class="post-list" aria-label="Recent posts">
    {#each data.posts as post}
      <li class="post-entry">
        <time class="post-date" datetime={post.date}>{formatDate(post.date)}</time>
        <h2 class="post-title">
          <a href="/{post.year}/{post.month}/{post.day}/{post.slug}/">{post.title}</a>
        </h2>
        {#if post.description}
          <p class="post-description">{post.description}</p>
        {/if}
        {#if post.tags.length > 0}
          <ul class="post-tags" aria-label="Tags">
            {#each post.tags as tag}
              <li class="post-tag">{tag}</li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ol>
</section>

<style>
  /* ─── Layout ──────────────────────────────────────────────── */
  .homepage {
    padding-block-start: 2rem;
  }

  /* ─── Site lede ───────────────────────────────────────────── */
  .lede {
    margin-block-end: 3.5rem;
    padding-block-end: 2.5rem;
    border-bottom: 1px solid oklch(var(--bc) / 0.12);
  }

  .lede p {
    font-style: italic;
    font-size: 1.125rem;
    line-height: 1.7;
    color: oklch(var(--bc) / 0.55);
    max-width: 38ch;
  }

  /* ─── Post list ───────────────────────────────────────────── */
  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ─── Individual entry ────────────────────────────────────── */
  .post-entry {
    padding-block: 2.25rem;
    border-bottom: 1px solid oklch(var(--bc) / 0.08);
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }

  .post-entry:first-child {
    padding-block-start: 0;
  }

  .post-entry:last-child {
    border-bottom: none;
  }

  /* ─── Date ────────────────────────────────────────────────── */
  .post-date {
    display: block;
    font-style: italic;
    font-size: 0.8125rem;
    letter-spacing: 0.01em;
    color: oklch(var(--bc) / 0.38);
    margin-block-end: 0.4rem;
  }

  /* ─── Title ───────────────────────────────────────────────── */
  .post-title {
    font-size: clamp(1.25rem, 3.5vw, 1.5rem);
    font-weight: 600;
    line-height: 1.25;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .post-title a {
    color: oklch(var(--bc));
    text-decoration: none;
    background-image: linear-gradient(
      oklch(var(--bc) / 0.2),
      oklch(var(--bc) / 0.2)
    );
    background-repeat: no-repeat;
    background-size: 0% 1px;
    background-position: 0 100%;
    transition: background-size 0.3s ease, color 0.2s ease;
  }

  .post-title a:hover {
    color: oklch(var(--p));
    background-size: 100% 1px;
    background-image: linear-gradient(
      oklch(var(--p) / 0.4),
      oklch(var(--p) / 0.4)
    );
  }

  /* ─── Description ─────────────────────────────────────────── */
  .post-description {
    font-style: italic;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: oklch(var(--bc) / 0.6);
    margin: 0;
    margin-block-start: 0.5rem;
    max-width: 56ch;
  }

  /* ─── Tags ────────────────────────────────────────────────── */
  .post-tags {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-block-start: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .post-tag {
    font-size: 0.6875rem;
    font-style: normal;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: oklch(var(--bc) / 0.4);
    padding: 0.2em 0.6em;
    border: 1px solid oklch(var(--bc) / 0.15);
    border-radius: 2px;
    line-height: 1.5;
    transition: color 0.2s ease, border-color 0.2s ease;
  }

  .post-tag:hover {
    color: oklch(var(--bc) / 0.65);
    border-color: oklch(var(--bc) / 0.3);
  }

  /* ─── Responsive ──────────────────────────────────────────── */
  @media (min-width: 600px) {
    .post-entry {
      gap: 0.4rem;
    }
  }
</style>
