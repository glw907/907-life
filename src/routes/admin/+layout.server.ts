import type { LayoutServerLoad } from './$types';
import { adminLayoutLoad } from '@glw907/cairn-cms/sveltekit';
import { cairn } from '$lib/cairn.config';

// The admin surface is dynamic and must never be prerendered, indexed, or Pagefind-crawled.
export const prerender = false;

export const load: LayoutServerLoad = (event) => adminLayoutLoad(event, cairn);
