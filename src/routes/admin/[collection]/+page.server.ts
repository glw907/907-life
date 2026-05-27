import type { Actions, PageServerLoad } from './$types';
import { collectionListLoad, createEntry } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

export const load: PageServerLoad = (event) => collectionListLoad(event, cairn);

export const actions: Actions = {
  create: (event) => createEntry(event, cairn),
};
