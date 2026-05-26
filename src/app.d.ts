// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SendEmail, D1Database } from '@cloudflare/workers-types';
import type { EmailSender } from '@glw907/cairn-cms';
import type { Auth, CairnUser } from '@glw907/cairn-cms/auth';

declare global {
  namespace App {
    interface Locals {
      // Per-request better-auth instance + resolved session (set in hooks.server.ts).
      auth: Auth;
      user: CairnUser | null;
    }
    interface Platform {
      env: {
        SEND_EMAIL: SendEmail;
        CONTACT_EMAIL: string;
        TURNSTILE_SECRET_KEY: string;
        // cairn-cms: Email Sending (transactional, arbitrary recipients) for magic links.
        EMAIL: EmailSender;
        // cairn-cms better-auth store + signing secret + base URL.
        AUTH_DB: D1Database;
        AUTH_SECRET: string;
        BETTER_AUTH_URL: string;
        // Optional origin override; supersedes BETTER_AUTH_URL (set in dev, unset in prod).
        PUBLIC_ORIGIN?: string;
        // GitHub App credentials — the commit signer (stays bespoke).
        GITHUB_APP_ID: string;
        GITHUB_APP_INSTALLATION_ID: string;
        GITHUB_APP_PRIVATE_KEY_B64: string;
      };
      context: ExecutionContext;
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
