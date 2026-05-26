import type { PageServerLoad } from './$types';
import { adminListLoad } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const load: PageServerLoad = (event) => adminListLoad(event, cairn);
