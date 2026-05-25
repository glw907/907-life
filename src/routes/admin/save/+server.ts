import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { cairn } from '$lib/cairn.config';
import { findCollection, frontmatterFromForm, serializeMarkdown, commitFile, installationToken } from 'cairn-cms';

// Split a comma-separated tags input into a trimmed, de-duplicated list. 907.life tags are
// free-form (no controlled vocabulary), so they ride a single text field rather than the
// generic checkbox renderer — hence this lives here, not in the adapter `fields`.
function parseTags(raw: FormDataEntryValue | null): string[] {
  return [...new Set(String(raw ?? '').split(',').map((t) => t.trim()).filter(Boolean))];
}

// SvelteKit's built-in same-origin check protects this POST (cross-origin form posts → 403),
// so no separate CSRF token is needed — same posture as the contact remote function.
export const POST: RequestHandler = async ({ request, platform, locals }) => {
  const editor = locals.editor;
  if (!editor) throw error(401, 'Not signed in');

  const env = platform?.env;
  if (!env?.GITHUB_APP_ID || !env.GITHUB_APP_INSTALLATION_ID || !env.GITHUB_APP_PRIVATE_KEY_B64) {
    throw error(500, 'GitHub App is not configured');
  }

  const form = await request.formData();
  const type = String(form.get('type') ?? '');
  const id = String(form.get('id') ?? '');
  const body = String(form.get('body') ?? '');
  const collection = findCollection(cairn, type);
  if (!collection || !id) throw error(400, 'Bad request');

  // Build frontmatter from the posted fields, fold in the free-form tags, and validate; a
  // bad field bounces back to the editor with the validator's message rather than 500ing.
  let frontmatter: object;
  try {
    const data = frontmatterFromForm(collection, form);
    data.tags = parseTags(form.get('tags'));
    frontmatter = collection.validate(data, `${id}.md`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid frontmatter';
    throw redirect(303, `/admin/edit/${type}/${id}?error=${encodeURIComponent(message)}`);
  }

  const markdown = serializeMarkdown(frontmatter, body);
  const token = await installationToken({
    appId: env.GITHUB_APP_ID,
    installationId: env.GITHUB_APP_INSTALLATION_ID,
    privateKeyB64: env.GITHUB_APP_PRIVATE_KEY_B64,
  });

  await commitFile(
    cairn.backend,
    `${collection.dir}/${id}.md`,
    markdown,
    { message: `Update ${collection.label.toLowerCase()}: ${id}`, author: { name: editor.name, email: editor.email } },
    token,
  );

  throw redirect(303, `/admin/edit/${type}/${id}?saved=1`);
};
