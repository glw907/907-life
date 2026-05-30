// The server-side engine wiring: compose the runtime once and build every admin route
// handler from it. Each +page.server.ts re-exports from here, so the engine is composed a
// single time per worker and the route files stay one line each.
import { composeRuntime } from '@glw907/cairn-cms';
import {
  createContentRoutes,
  createAuthRoutes,
  createEditorRoutes,
  createNavRoutes,
} from '@glw907/cairn-cms/sveltekit';
import { cairn } from './cairn.config.js';

export const runtime = composeRuntime(cairn);
export const content = createContentRoutes(runtime);
export const auth = createAuthRoutes({ branding: { siteName: cairn.siteName, from: cairn.sender.from } });
export const editors = createEditorRoutes();
export const nav = createNavRoutes(runtime);
