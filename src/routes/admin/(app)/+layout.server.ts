import { content } from '$lib/cairn.server.js';

// The authed admin shell load. Only the (app) group runs it, so it is reached only with a
// session the guard already resolved; layoutLoad's own session check never bounces the login page.
export const load = content.layoutLoad;
