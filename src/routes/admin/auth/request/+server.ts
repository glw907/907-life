import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { createMagicLink, lookupEditor, sendMagicLink } from 'cairn-cms';
import { cairn } from '$lib/cairn.config';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const POST: RequestHandler = async ({ request, platform, url }) => {
  const env = platform?.env;
  if (!env?.AUTH_KV || !env.MAGIC_LINK_SECRET || !env.EMAIL) {
    throw redirect(303, '/admin/login?error=config');
  }

  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    throw redirect(303, '/admin/login?error=invalid');
  }

  const editor = await lookupEditor(email, env.AUTH_KV);
  if (!editor) {
    throw redirect(303, '/admin/login?error=denied');
  }

  const token = await createMagicLink(email, env.MAGIC_LINK_SECRET, env.AUTH_KV);
  // PUBLIC_ORIGIN overrides url.origin for local dev (where wrangler's custom-domain
  // route makes url.origin the production host); unset in prod → url.origin is correct.
  const origin = env.PUBLIC_ORIGIN || url.origin;
  const link = `${origin}/admin/auth/callback?token=${encodeURIComponent(token)}`;
  try {
    await sendMagicLink(env.EMAIL, email, link, cairn.siteName, cairn.sender);
  } catch (err) {
    console.error('magic-link send failed:', err);
    throw redirect(303, '/admin/login?error=config');
  }

  throw redirect(303, '/admin/login?sent=1');
};
