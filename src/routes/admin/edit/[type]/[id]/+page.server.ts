import type { PageServerLoad } from './$types';
import { editLoad } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const load: PageServerLoad = (event) => editLoad(event, cairn);
