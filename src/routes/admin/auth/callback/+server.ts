import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { redeemMagicToken, lookupEditor, createSession, SESSION_COOKIE, SESSION_MAX_AGE } from 'cairn-cms';

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
  const env = platform?.env;
  if (!env?.AUTH_KV || !env.MAGIC_LINK_SECRET || !env.SESSION_SECRET) {
    throw redirect(303, '/admin/login?error=config');
  }

  const token = url.searchParams.get('token') ?? '';
  const email = await redeemMagicToken(token, env.MAGIC_LINK_SECRET, env.AUTH_KV);
  if (!email) {
    throw redirect(303, '/admin/login?error=expired');
  }

  // Re-check the allowlist at redemption — membership may have changed since issue.
  const editor = await lookupEditor(email, env.AUTH_KV);
  if (!editor) {
    throw redirect(303, '/admin/login?error=denied');
  }

  const session = await createSession(editor, env.SESSION_SECRET);
  cookies.set(SESSION_COOKIE, session, {
    path: '/',
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
  });

  throw redirect(303, '/admin');
};
