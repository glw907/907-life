import type { PageServerLoad, Actions } from './$types';
import { navLoad, navSave } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const load: PageServerLoad = (event) => navLoad(event, cairn);

export const actions: Actions = {
  save: (event) => navSave(event, cairn),
};
