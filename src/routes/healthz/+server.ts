import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { healthLoad } from '@glw907/cairn-cms/sveltekit';
import { runtime } from '$lib/cairn.server.js';

export const GET: RequestHandler = async (event) => {
  try {
    return json(await healthLoad(event, runtime));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return json({ ok: false, checks: { githubAppSigning: { ok: false, detail } } });
  }
};
