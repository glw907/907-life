<!-- @component
907's contact form: a progressively-enhanced form action gated by Turnstile, on the same DaisyUI v5
`fieldset`/`legend` idiom the admin uses. The widget script is loaded once in the page head. The
site key comes from the runtime `PUBLIC_TURNSTILE_SITE_KEY` var (wrangler.toml), never a hardcoded
literal, so the deploy environment can swap the test key for the real one with no code change. -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import { env } from '$env/dynamic/public';

  interface FormState {
    success?: boolean;
    error?: string;
    values?: { name: string; email: string; message: string };
  }

  let { form }: { form: FormState | null } = $props();

  let submitting = $state(false);

  const turnstileSiteKey = env.PUBLIC_TURNSTILE_SITE_KEY;
</script>

<svelte:head>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<section id="contact" class="mt-xl border-t border-card-border pt-l">
  <h2 class="m-0 mb-m font-display text-step-2 font-semibold tracking-tight">Contact</h2>

  {#if form?.success}
    <p class="text-step-0 text-muted italic">Message sent. I'll get back to you soon.</p>
  {:else}
    <form
      method="POST"
      class="max-w-measure"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update();
          submitting = false;
        };
      }}
    >
      <fieldset class="fieldset gap-3">
        {#if form?.error}
          <p class="text-step--1 text-error" role="alert">{form.error}</p>
        {/if}

        <label class="fieldset-label" for="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          class="input w-full"
          required
          autocomplete="name"
          value={form?.values?.name ?? ''}
        />

        <label class="fieldset-label" for="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          class="input w-full"
          required
          autocomplete="email"
          value={form?.values?.email ?? ''}
        />

        <label class="fieldset-label" for="contact-message">Message</label>
        <textarea id="contact-message" name="message" class="textarea w-full" rows="5" required
          >{form?.values?.message ?? ''}</textarea
        >

        <div class="cf-turnstile" data-sitekey={turnstileSiteKey}></div>

        <button type="submit" class="btn btn-primary mt-s self-start" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </fieldset>
    </form>
  {/if}
</section>
