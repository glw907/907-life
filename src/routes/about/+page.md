<script lang="ts">
  import type { ActionData } from './$types';
  import ContactForm from '$lib/components/ContactForm.svelte';
  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>About — 907.life</title>
  <meta name="description" content="Geoffrey L. Wright — technology professional in Alaska." />
</svelte:head>

<div class="about-page post-body">

## About Geoffrey

I'm Geoffrey L. Wright, a technology professional living in Alaska. This blog is where I write about Alaska adventures, philosophical musings, technology, books, music, photography, and whatever else comes to mind.

After years of living in the Pacific Northwest, I've found a home in the Last Frontier, where the long summer days and quiet winter nights provide plenty of space for reflection and exploration.

This site is a place for me to share stories, thoughts, and discoveries from life at 907.

<ContactForm {form} />

</div>

<style>
  .about-page {
    padding-block-start: 3rem;
  }

  .about-page :global(h2:first-of-type) {
    font-size: clamp(1.55rem, 4.5vw, 1.95rem);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -0.02em;
    color: oklch(18% 0.01 230);
    margin: 0 0 1.75rem;
  }
</style>
