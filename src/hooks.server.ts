import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import { createAuth, loadSession } from '@glw907/cairn-cms/auth';
import { cairn } from '$lib/cairn.config';

// Routes under /admin (and the better-auth API) an unauthenticated visitor may still reach.
function isPublicAdminPath(pathname: string): boolean {
  return (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/auth/') ||
    pathname.startsWith('/api/auth/')
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  // Per-request better-auth instance (the D1 binding is request-scoped); resolve the session.
  if (!building && event.platform?.env) {
    event.locals.auth = createAuth(event.platform.env, {
      siteName: cairn.siteName,
      sender: cairn.sender,
    });
    event.locals.user = await loadSession(event.locals.auth, event.request);
  } else {
    event.locals.user = null;
  }

  // Guard the admin surface; bounce anonymous requests to the login page.
  const { pathname } = event.url;
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  if (isAdmin && !isPublicAdminPath(pathname) && !event.locals.user) {
    throw redirect(303, '/admin/login');
  }

  const theme = event.cookies.get('theme') ?? '';
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('data-theme=""', `data-theme="${theme}"`),
  });
};
