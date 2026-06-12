// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SendEmail, D1Database } from '@cloudflare/workers-types';
// AuthEnv lives on the package root, not the /sveltekit subpath; the subpath import typechecks
// only because skipLibCheck swallows the missing-member error inside this declaration file.
import type { AuthEnv } from '@glw907/cairn-cms';

// App.Locals.editor (set by the engine's auth guard) ships with the engine.
import '@glw907/cairn-cms/ambient';

declare global {
  namespace App {
    interface Platform {
      env: {
        SEND_EMAIL: SendEmail;
        CONTACT_EMAIL: string;
        TURNSTILE_SECRET_KEY: string;
        // cairn-cms: Email Sending (transactional, arbitrary recipients) for magic links.
        EMAIL: NonNullable<AuthEnv['EMAIL']>;
        // cairn-cms self-owned auth store (editor allowlist, sessions, magic tokens).
        AUTH_DB: D1Database;
        // Canonical origin for magic-link confirmation links (never from a request header).
        PUBLIC_ORIGIN: string;
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
