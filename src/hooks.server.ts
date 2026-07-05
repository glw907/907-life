// The engine's auth guard owns /admin gating: the magic-link session cookie, CSRF, and the
// admin-route dispatch. 907's own theme-cookie toggle (retired with the old app) returns as a
// Waymark template mechanism in a later pass; this site consumes it once it lands rather than
// carrying its own bespoke copy forward.
import { createAuthGuard } from '@glw907/cairn-cms/sveltekit';

export const handle = createAuthGuard();
