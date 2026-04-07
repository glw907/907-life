import type { PageServerLoad } from './$types';
import { getAllTags } from '$lib/posts';

export const load: PageServerLoad = () => {
  return { tags: getAllTags() };
};
