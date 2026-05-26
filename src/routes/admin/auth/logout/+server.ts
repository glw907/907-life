import type { RequestHandler } from './$types';
import { logout } from 'cairn-cms/sveltekit';

export const POST: RequestHandler = (event) => logout(event);
