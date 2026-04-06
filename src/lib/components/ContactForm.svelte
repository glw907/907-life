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
        <label class="field-label" for="name">Name</label>
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
        <label class="field-label" for="email">Email</label>
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
        <label class="field-label" for="message">Message</label>
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
    border-top: 1px solid oklch(88% 0.005 230);
  }

  .contact-heading {
    font-size: clamp(1.15rem, 3vw, 1.35rem);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: oklch(18% 0.01 230);
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

  .field-label {
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: oklch(55% 0.008 230);
  }

  .field-input {
    font-family: inherit;
    font-size: 0.975rem;
    color: oklch(22% 0.01 230);
    background: oklch(98% 0.002 230);
    border: 1px solid oklch(82% 0.006 230);
    border-radius: 3px;
    padding: 0.55rem 0.75rem;
    width: 100%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
  }

  .field-input:focus {
    border-color: oklch(62% 0.012 230);
    box-shadow: 0 0 0 3px oklch(62% 0.012 230 / 0.12);
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
    color: oklch(98% 0.002 230);
    background: oklch(28% 0.01 230);
    border: none;
    border-radius: 3px;
    padding: 0.6em 1.4em;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: oklch(20% 0.01 230);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .form-success {
    font-style: italic;
    color: oklch(42% 0.012 145);
    font-size: 0.975rem;
  }

  .form-error {
    font-size: 0.875rem;
    color: oklch(45% 0.02 25);
    padding: 0.6rem 0.75rem;
    background: oklch(96% 0.008 25);
    border: 1px solid oklch(85% 0.015 25);
    border-radius: 3px;
  }
</style>
