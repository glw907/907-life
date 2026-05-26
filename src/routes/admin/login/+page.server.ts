import type { PageServerLoad } from './$types';
import { loginLoad } from 'cairn-cms/sveltekit';

export const load: PageServerLoad = (event) => loginLoad(event);
