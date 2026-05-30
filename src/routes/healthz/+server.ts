import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { healthLoad } from '@glw907/cairn-cms/sveltekit';
import { runtime } from '$lib/cairn.server.js';

// The site defaults to prerender=true; force this endpoint dynamic so it reads the live env
// (the GitHub App key) at request time instead of being prerendered to a build-time ok:false.
export const prerender = false;

export const GET: RequestHandler = async (event) => {
  try {
    return json(await healthLoad(event, runtime));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return json({ ok: false, checks: { githubAppSigning: { ok: false, detail } } });
  }
};
