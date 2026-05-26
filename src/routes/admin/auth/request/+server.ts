import type { RequestHandler } from './$types';
import { authRequest } from 'cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const POST: RequestHandler = (event) => authRequest(event, cairn);
