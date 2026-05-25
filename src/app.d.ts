// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SendEmail, KVNamespace } from '@cloudflare/workers-types';
import type { Editor, EmailSender } from 'cairn-cms';

declare global {
  namespace App {
    interface Locals {
      editor: Editor | null;
    }
    interface Platform {
      env: {
        SEND_EMAIL: SendEmail;
        CONTACT_EMAIL: string;
        TURNSTILE_SECRET_KEY: string;
        // cairn-cms: Email Sending (transactional, arbitrary recipients) for magic links.
        EMAIL: EmailSender;
        AUTH_KV: KVNamespace;
        // cairn auth secrets (wrangler secret put / .dev.vars).
        MAGIC_LINK_SECRET: string;
        SESSION_SECRET: string;
        // Optional magic-link base URL; overrides url.origin (set in dev, unset in prod).
        PUBLIC_ORIGIN?: string;
        // GitHub App credentials — mint install tokens for private-repo reads + commits.
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
