// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SendEmail, D1Database } from '@cloudflare/workers-types';
import type { Editor, AuthEnv } from '@glw907/cairn-cms';

declare global {
  namespace App {
    interface Locals {
      // The session the cairn auth guard resolved for /admin (set in hooks.server.ts).
      editor: Editor | null;
    }
    interface Platform {
      env: {
        SEND_EMAIL: SendEmail;
        CONTACT_EMAIL: string;
        TURNSTILE_SECRET_KEY: string;
        // cairn-cms: Email Sending (transactional, arbitrary recipients) for magic links.
        EMAIL: NonNullable<AuthEnv['EMAIL']>;
        // cairn-cms better-auth store + signing secret + base URL.
        AUTH_DB: D1Database;
        AUTH_SECRET: string;
        BETTER_AUTH_URL: string;
        // Optional origin override; supersedes BETTER_AUTH_URL (set in dev, unset in prod).
        PUBLIC_ORIGIN?: string;
        // GitHub App credentials for the commit signer (stays bespoke).
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
