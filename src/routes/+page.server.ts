import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/posts';

export const load: PageServerLoad = () => {
  const posts = getAllPosts();
  return { posts };
};
