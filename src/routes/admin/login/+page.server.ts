import { auth } from '$lib/cairn.server.js';

export const load = auth.loginLoad;
export const actions = { default: auth.requestAction };
