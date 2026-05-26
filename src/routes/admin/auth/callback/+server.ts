import type { RequestHandler } from './$types';
import { authCallback } from '@glw907/cairn-cms/sveltekit';

export const GET: RequestHandler = (event) => authCallback(event);
