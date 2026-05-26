import type { RequestHandler } from './$types';
import { saveCommit } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const POST: RequestHandler = (event) => saveCommit(event, cairn);
