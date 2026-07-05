<!-- @component 907's about page: a static bio (not cairn content) plus the contact form. -->
<script lang="ts">
  import type { ActionData } from './$types';
  import ContactForm from '$lib/components/ContactForm.svelte';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>About · 907.life</title>
  <meta name="description" content="Geoffrey L. Wright, a technology professional writing from Alaska." />
</svelte:head>

<article class="prose">
  <h1>About Geoffrey</h1>
  <p>
    I'm Geoffrey L. Wright, a technology professional living in Alaska. This blog is where I write
    about Alaska adventures, philosophical musings, technology, books, music, photography, and
    whatever else comes to mind.
  </p>
  <p>
    After years in the Pacific Northwest, I've found a home in the Last Frontier, where the long
    summer days and quiet winter nights leave plenty of room for reflection and exploration.
  </p>
  <p>This site is where I share stories, thoughts, and discoveries from life at 907.</p>
</article>

<ContactForm {form} />
