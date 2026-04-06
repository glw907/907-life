// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SendEmail } from '@cloudflare/workers-types';

declare global {
  namespace App {
    interface Platform {
      env: {
        SEND_EMAIL: SendEmail;
        CONTACT_EMAIL: string;
        TURNSTILE_SECRET_KEY: string;
      };
      context: ExecutionContext;
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
