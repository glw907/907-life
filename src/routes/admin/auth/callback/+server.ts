import type { RequestHandler } from './$types';
import { authCallback } from 'cairn-cms/sveltekit';

export const GET: RequestHandler = (event) => authCallback(event);
