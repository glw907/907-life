import { type Handle, redirect } from '@sveltejs/kit';
import { verifySession, SESSION_COOKIE } from 'cairn-cms';

// Routes under /admin that an unauthenticated visitor may still reach.
function isPublicAdminPath(pathname: string): boolean {
  return pathname === '/admin/login' || pathname.startsWith('/admin/auth/');
}

export const handle: Handle = async ({ event, resolve }) => {
  const env = event.platform?.env;

  // Resolve the editor from the signed session cookie (null when absent/invalid).
  event.locals.editor = null;
  const token = event.cookies.get(SESSION_COOKIE);
  if (token && env?.SESSION_SECRET) {
    event.locals.editor = await verifySession(token, env.SESSION_SECRET);
  }

  // Guard the admin surface; bounce anonymous requests to the login page.
  const { pathname } = event.url;
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  if (isAdmin && !isPublicAdminPath(pathname) && !event.locals.editor) {
    throw redirect(303, '/admin/login');
  }

  const theme = event.cookies.get('theme') ?? '';
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('data-theme=""', `data-theme="${theme}"`),
  });
};
