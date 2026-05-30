// /admin must never be prerendered (dynamic auth and content). The authed shell load lives in
// the (app) group, so the public login and auth pages do not run the session-requiring layout
// load and cannot loop back to /admin/login.
export const prerender = false;
