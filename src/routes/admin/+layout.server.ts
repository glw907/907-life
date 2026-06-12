// The site defaults to prerender=true, so scope the opt-out over the whole /admin subtree by
// construction: a future sibling route added beside the catch-all must not bake a build-time
// snapshot of a session-gated page.
export const prerender = false;
