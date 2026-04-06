import type { PageServerLoad } from './$types';
import { getAllPosts, getPost } from '$lib/posts';

export const load: PageServerLoad = async () => {
  const posts = getAllPosts();
  const first = posts[0];
  const featured = first
    ? await getPost(first.year, first.month, first.day, first.slug)
    : null;
  return { posts, featured };
};
