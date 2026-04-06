export const prerender = true;

import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/posts';

export const load: PageServerLoad = () => {
  return { posts: getAllPosts() };
};
