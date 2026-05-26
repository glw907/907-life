import type { RequestHandler } from './$types';
import { logout } from '@glw907/cairn-cms/sveltekit';

export const POST: RequestHandler = (event) => logout(event);
