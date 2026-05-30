import type { RequestHandler } from './$types.js';
import { auth } from '$lib/cairn.server.js';

export const POST: RequestHandler = (event) => auth.logoutAction(event);
