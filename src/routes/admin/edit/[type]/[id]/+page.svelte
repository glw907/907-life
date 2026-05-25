<script lang="ts">
  import { browser } from '$app/environment';
  import { Carta, MarkdownEditor } from 'carta-md';
  import 'carta-md/default.css';
  import { previewCartaOptions } from 'cairn-cms';
  import { cairn } from '$lib/cairn.config';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // Body is editable state; the Carta editor's preview runs the site plugin set so it
  // matches the live page. A hidden input carries the current value into the form.
  // svelte-ignore state_referenced_locally — seeding from the initial load is intended.
  let body = $state(data.body);

  const carta = new Carta(previewCartaOptions(cairn.preview));

  // svelte-ignore state_referenced_locally — form defaults from the initial load.
  const fm = data.frontmatter as Record<string, unknown>;
  function fmString(key: string): string {
    return typeof fm[key] === 'string' ? (fm[key] as string) : '';
  }
  // 907.life tags are free-form — edited as a comma-separated text field (see save/parseTags).
  const tagsValue = Array.isArray(fm.tags) ? (fm.tags as unknown[]).map(String).join(', ') : '';
</script>

<svelte:head>
  <title>Edit {data.title} · {cairn.siteName} CMS</title>
</svelte:head>

<div class="flex items-center justify-between gap-4">
  <div>
    <a href="/admin" class="text-sm opacity-70 hover:underline">← Back</a>
    <h1 class="mt-1 text-2xl font-bold">{data.title}</h1>
    <p class="text-sm opacity-60">{data.label} · {data.path}</p>
  </div>
</div>

{#if data.saved}
  <div class="alert alert-success mt-6"><span>Saved — committed to main; the site will redeploy.</span></div>
{:else if data.error}
  <div class="alert alert-error mt-6"><span>{data.error}</span></div>
{/if}

<form method="POST" action="/admin/save" class="mt-6 flex flex-col gap-5">
  <input type="hidden" name="type" value={data.type} />
  <input type="hidden" name="id" value={data.id} />

  <fieldset class="grid gap-4 rounded-box border border-base-300 bg-base-100 p-6">
    {#each data.fields as field (field.name)}
      {#if field.type === 'text' || field.type === 'date'}
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium">{field.label}</span>
          <input
            type={field.type === 'date' ? 'date' : 'text'}
            name={field.name}
            required={field.required}
            value={fmString(field.name)}
            class="input input-bordered w-full"
          />
        </label>
      {:else if field.type === 'textarea'}
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium">{field.label}</span>
          <textarea name={field.name} required={field.required} rows={field.rows ?? 4}
            class="textarea textarea-bordered w-full">{fmString(field.name)}</textarea>
        </label>
      {:else if field.type === 'boolean'}
        <label class="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name={field.name} checked={fm[field.name] === true} class="checkbox checkbox-sm" />
          {field.label}
        </label>
      {/if}
    {/each}

    <label class="flex flex-col gap-1">
      <span class="text-sm font-medium">Tags</span>
      <input type="text" name="tags" value={tagsValue} placeholder="comma, separated"
        class="input input-bordered w-full" />
    </label>
  </fieldset>

  <div class="rounded-box border border-base-300 bg-base-100 p-2">
    <input type="hidden" name="body" value={body} />
    {#if browser}
      <MarkdownEditor {carta} bind:value={body} mode="tabs" />
    {:else}
      <textarea bind:value={body} rows="20" class="textarea textarea-bordered w-full font-mono"></textarea>
    {/if}
  </div>

  <div class="flex justify-end">
    <button type="submit" class="btn btn-primary">Save &amp; commit</button>
  </div>
</form>
