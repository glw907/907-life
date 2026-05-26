import type { RequestHandler } from './$types';

// better-auth catch-all: every /api/auth/* request goes to the per-request handler from hooks.
const handler: RequestHandler = ({ request, locals }) => locals.auth.handler(request);

export const GET = handler;
export const POST = handler;
