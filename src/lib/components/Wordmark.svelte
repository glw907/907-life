<!-- @component
907's split wordmark, shared by SiteHeader and SiteFooter so the two chrome components cannot drift
apart: `907` sits in the body face (Spectral) at display weight, `.life` in the display face (Karla)
at a smaller, muted, baseline-raised size, the two spans aligned on a shared baseline.
-->
<a href="/" class="wordmark inline-flex items-baseline no-underline">
  <span class="wordmark__mark">907</span><span class="wordmark__tld">.life</span>
</a>

<style>
  .wordmark {
    white-space: nowrap;
    transition: opacity 0.15s;
  }
  .wordmark:hover {
    opacity: 0.75;
  }
  .wordmark:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
  .wordmark__mark {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 1.6rem;
    letter-spacing: -0.025em;
    color: var(--color-base-content);
  }
  .wordmark__tld {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1rem;
    letter-spacing: 0.04em;
    color: var(--color-muted);
    margin-left: 0.05em;
    position: relative;
    top: -0.04em;
  }
</style>
