import type { PageServerLoad } from './$types';
import { postList, posts, linkResolver } from '$lib/content';
import { cairn } from '$lib/cairn.config';

export const load: PageServerLoad = async () => {
  const list = postList();
  const first = list[0];
  const featured = first
    ? {
        permalink: first.permalink,
        title: first.title,
        date: first.date,
        tags: first.tags,
        html: await cairn.render(posts.byId(first.id)!.body, { resolve: linkResolver }),
      }
    : null;
  return { posts: list, featured };
};
