import type { PageServerLoad } from './$types';
import { getAllPosts, getPost } from '$lib/posts';
import { error } from '@sveltejs/kit';

export function entries() {
  return getAllPosts().map(({ year, month, day, slug }) => ({ year, month, day, slug }));
}

export const load: PageServerLoad = async ({ params }) => {
  const post = await getPost(params.year, params.month, params.day, params.slug);
  if (!post) error(404, 'Post not found');
  return { post };
};
