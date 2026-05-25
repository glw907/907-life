import type { PageServerLoad } from './$types';
import { cairn } from '$lib/cairn.config';
import { listMarkdown, type RepoFile } from 'cairn-cms';

interface Collection {
  type: string;
  label: string;
  files: RepoFile[];
  error?: string;
}

export const load: PageServerLoad = async () => {
  // Reads are anonymous — 907.life's repo is public (like ecnordic). The GitHub App token
  // is only needed for the commit path (/admin/save).
  const collections: Collection[] = await Promise.all(
    cairn.collections.map(async ({ type, label, dir }) => {
      try {
        return { type, label, files: await listMarkdown(cairn.backend, dir) };
      } catch (err) {
        // A failed listing (rate limit, network) shouldn't 500 the whole admin.
        return { type, label, files: [], error: err instanceof Error ? err.message : 'Failed to load' };
      }
    }),
  );
  return { collections };
};
