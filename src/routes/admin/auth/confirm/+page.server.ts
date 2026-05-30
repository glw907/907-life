import { auth } from '$lib/cairn.server.js';

export const load = auth.confirmLoad;
export const actions = { default: auth.confirmAction };
