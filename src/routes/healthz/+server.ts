import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { healthLoad } from '@glw907/cairn-cms/sveltekit';
import { runtime } from '$chassis/cairn.server.js';

// The site defaults to prerender=true; force this endpoint dynamic so it reads the live env
// (the GitHub App key) at request time instead of being prerendered to a build-time ok:false.
export const prerender = false;

export const GET: RequestHandler = async (event) => {
  try {
    return json(await healthLoad(event, runtime));
  } catch (err) {
    // The endpoint is unauthenticated, so the raw message (import and config error strings,
    // recon-grade) stays in the log; callers get only the boolean.
    console.error('healthz signing check failed:', err);
    return json({ ok: false, checks: { githubAppSigning: { ok: false, detail: 'unavailable' } } });
  }
};
