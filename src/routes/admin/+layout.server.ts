// The shared admin shell's load: the chrome (nav, user, theme, streamed pending count) for every
// /admin/** route. The site defaults to prerender=true, so scope the opt-out over the whole
// subtree by construction: a future sibling route added beside the catch-all must not bake a
// build-time snapshot of a session-gated page.
import { admin } from '$chassis/cairn.server.js';

export const prerender = false;

export const load = admin.shellLoad;
