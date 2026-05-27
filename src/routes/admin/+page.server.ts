import type { PageServerLoad } from './$types';
import { adminIndexRedirect } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const load: PageServerLoad = () => adminIndexRedirect(cairn);
