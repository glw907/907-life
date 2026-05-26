import type { RequestHandler } from './$types';
import { signOut } from '@glw907/cairn-cms/auth';

export const POST: RequestHandler = (event) => signOut(event);
