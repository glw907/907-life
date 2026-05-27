import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { healthLoad } from '@glw907/cairn-cms/sveltekit';

// Deploy-time health check (M2). Behind the /admin guard, so a signed-in editor can confirm the
// GitHub App key still signs before relying on save. Returns ok/fail JSON, no secret in the body.
export const GET: RequestHandler = async (event) => json(await healthLoad(event));
