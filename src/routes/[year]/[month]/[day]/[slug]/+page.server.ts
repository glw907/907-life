import type { PageServerLoad } from './$types';
import { getPost } from '$lib/posts';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const post = await getPost(params.year, params.month, params.day, params.slug);
  if (!post) throw error(404, 'Post not found');
  return { post };
};
