import type { PageServerLoad } from './$types';
import { getAllPosts, getAllTags } from '$lib/posts';

export const load: PageServerLoad = () => {
  return { posts: getAllPosts(), tags: getAllTags() };
};
