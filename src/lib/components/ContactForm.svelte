<script lang="ts">
  import { enhance } from '$app/forms';

  interface FormState {
    success?: boolean;
    error?: string;
    values?: { name: string; email: string; message: string };
  }

  let { form }: { form: FormState | null } = $props();

  let submitting = $state(false);
</script>

<section id="contact" class="contact-section">
  <h2 class="contact-heading">Contact</h2>

  {#if form?.success}
    <p class="form-success">Message sent — I'll get back to you soon.</p>
  {:else}
    <form
      method="POST"
      class="contact-form"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update();
          submitting = false;
        };
      }}
    >
      {#if form?.error}
        <p class="form-error">{form.error}</p>
      {/if}

      <div class="field">
        <label class="post-date" for="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          class="field-input"
          required
          autocomplete="name"
          value={form?.values?.name ?? ''}
        />
      </div>

      <div class="field">
        <label class="post-date" for="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          class="field-input"
          required
          autocomplete="email"
          value={form?.values?.email ?? ''}
        />
      </div>

      <div class="field">
        <label class="post-date" for="message">Message</label>
        <textarea
          id="message"
          name="message"
          class="field-input field-textarea"
          required
        >{form?.values?.message ?? ''}</textarea>
      </div>

      <div
        class="cf-turnstile"
        data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
      ></div>

      <button type="submit" class="submit-btn" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>

    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  {/if}
</section>

<style>
  .contact-section {
    margin-block-start: 3.5rem;
    padding-block-start: 3rem;
    border-top: 1px solid var(--color-border-subtle);
  }

  .contact-heading {
    font-size: clamp(1.15rem, 3vw, 1.35rem);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--color-heading);
    margin: 0 0 1.75rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 34rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .field-input {
    font-family: inherit;
    font-size: 0.975rem;
    color: var(--color-heading);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 3px;
    padding: 0.55rem 0.75rem;
    width: 100%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
  }

  .field-input:focus {
    border-color: var(--color-muted);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
  }

  .field-textarea {
    resize: vertical;
    min-height: 8rem;
    line-height: 1.55;
  }

  .submit-btn {
    align-self: flex-start;
    font-family: inherit;
    font-size: 0.8rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--color-surface);
    background: var(--color-body);
    border: none;
    border-radius: 3px;
    padding: 0.6em 1.4em;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: var(--color-heading);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .form-success {
    font-style: italic;
    color: var(--color-success);
    font-size: 0.975rem;
  }

  .form-error {
    font-size: 0.875rem;
    color: var(--color-error);
    padding: 0.6rem 0.75rem;
    background: var(--color-error-bg);
    border: 1px solid var(--color-error-border);
    border-radius: 3px;
  }
</style>
