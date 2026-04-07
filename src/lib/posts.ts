import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import type { PostDetail, PostSummary } from './types.js';

// Bundled at build time — no runtime filesystem access needed.
// Keys are absolute paths like "/src/content/posts/2026-03-06-early-march.md"
const rawFiles = import.meta.glob<string>('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

let _cachedPosts: PostSummary[] | null = null;

function parseFilepath(filepath: string): Pick<PostSummary, 'year' | 'month' | 'day' | 'slug'> {
  const filename = filepath.split('/').pop()!.replace('.md', '');
  const [year, month, day, ...slugParts] = filename.split('-');
  return { year, month, day, slug: slugParts.join('-') };
}

function buildSummary(
  coords: Pick<PostSummary, 'year' | 'month' | 'day' | 'slug'>,
  data: Record<string, unknown>
): PostSummary {
  return {
    ...coords,
    title: data.title as string ?? '',
    date: data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date ?? ''),
    draft: data.draft as boolean ?? false,
    description: data.description as string ?? '',
    tags: data.tags as string[] ?? []
  };
}

/** Returns all non-draft posts sorted newest-first. */
export function getAllPosts(includeDrafts = false): PostSummary[] {
  if (!includeDrafts && _cachedPosts) return _cachedPosts;

  const posts: PostSummary[] = [];
  for (const [filepath, raw] of Object.entries(rawFiles)) {
    const coords = parseFilepath(filepath);
    const { data } = matter(raw);
    if (!includeDrafts && data.draft) continue;
    posts.push(buildSummary(coords, data));
  }
  const sorted = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!includeDrafts) _cachedPosts = sorted;
  return sorted;
}

/** Returns all unique tags across non-draft posts, sorted alphabetically with counts. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

/** Returns all non-draft posts with the given tag, sorted newest-first. */
export function getPostsByTag(tag: string): PostSummary[] {
  return getAllPosts().filter(p => p.tags.includes(tag));
}

/** Returns a single post with rendered HTML, or null if not found. */
export async function getPost(
  year: string,
  month: string,
  day: string,
  slug: string
): Promise<PostDetail | null> {
  const filepath = `/src/content/posts/${year}-${month}-${day}-${slug}.md`;
  const raw = rawFiles[filepath];
  if (!raw) return null;

  const { data, content } = matter(raw);
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);

  return {
    ...buildSummary({ year, month, day, slug }, data),
    html: processed.toString()
  };
}
