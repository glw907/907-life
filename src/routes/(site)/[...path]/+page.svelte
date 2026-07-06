<!-- @component A published post: the date stamp and title lead the reading surface, the tag pills
     and a back-link close it out, matching the site's original post-template chrome. -->
<script lang="ts">
  import type { PageData } from './$types';
  import { CairnHead } from '@glw907/cairn-cms/delivery/head';
  import { extractVocabulary } from '@glw907/cairn-cms';
  import { siteConfig } from '$lib/cairn.config';
  import { formatDate } from '$lib/format-date';

  let { data }: { data: PageData } = $props();

  const labels = Object.fromEntries(
    extractVocabulary(siteConfig).map((entry) => [entry.value, entry.label]),
  );
</script>

<CairnHead seo={data.seo} titleTemplate={(title) => `${title} · ${siteConfig.siteName}`} />

<article class="post">
  {#if data.entry.date}
    <time class="post__date" datetime={data.entry.date}>{formatDate(data.entry.date)}</time>
  {/if}

  <!-- The bespoke reading surface. The `.prose` container caps the column at the measure and binds
       every element to the theme tokens (prose.css, @import-ed into theme.css). -->
  <div class="prose">
    {#if data.heroImage}
      <figure class="hero">
        <img src={data.heroImage.url} alt={data.heroImage.alt} />
        {#if data.heroImage.caption}
          <figcaption>{data.heroImage.caption}</figcaption>
        {/if}
      </figure>
    {/if}
    <h1>{data.entry.title}</h1>
    {@html data.html}
  </div>

  {#if data.entry.tags.length > 0}
    <ul class="post__tags" aria-label="Tags">
      {#each data.entry.tags as tag (tag)}
        <li><a href="/tags/{tag}/" class="post__tag">{labels[tag] ?? tag}</a></li>
      {/each}
    </ul>
  {/if}

  <footer class="post__footer">
    <a href="/" class="post__back">&larr; All posts</a>
  </footer>
</article>

<style>
  /* The old date-stamp idiom: a quiet uppercase letterspaced label, not the fluid type scale (no
     step matches 0.72rem). */
  .post__date {
    display: block;
    margin-bottom: var(--spacing-s);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-muted);
  }

  /* The old .post-tag idiom: a bordered uppercase chip, distinct from the archive list's
     hash-prefixed plain tag (PostRow.svelte). */
  .post__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2xs);
    margin: var(--spacing-l) 0 0;
    padding: 0;
    list-style: none;
  }
  .post__tag {
    display: inline-block;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-muted);
    padding: 0.2em 0.55em;
    border: var(--border) solid var(--color-card-border);
    border-radius: 2px;
    text-decoration: none;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .post__tag:hover {
    color: var(--color-base-content);
    border-color: var(--color-muted);
  }

  .post__footer {
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-l);
    border-top: var(--border) solid var(--color-card-border);
  }
  .post__back {
    font-size: var(--text-step--1);
    color: var(--color-muted);
    text-decoration: none;
  }
  .post__back:hover {
    color: var(--color-base-content);
  }
</style>
