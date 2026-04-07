import type { PageServerLoad } from './$types';
import { getAllTags, getPostsByTag } from '$lib/posts';
import { error } from '@sveltejs/kit';

export function entries() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export const load: PageServerLoad = ({ params }) => {
  const posts = getPostsByTag(params.tag);
  if (posts.length === 0) error(404, 'Tag not found');
  return { tag: params.tag, posts };
};
