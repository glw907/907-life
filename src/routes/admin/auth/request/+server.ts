import type { RequestHandler } from './$types';
import { authRequest } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const POST: RequestHandler = (event) => authRequest(event, cairn);
