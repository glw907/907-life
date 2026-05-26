import type { PageServerLoad } from './$types';
import { loginLoad } from '@glw907/cairn-cms/sveltekit';

export const load: PageServerLoad = (event) => loginLoad(event);
