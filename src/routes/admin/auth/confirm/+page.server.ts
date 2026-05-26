import type { PageServerLoad, Actions } from './$types';
import { confirmSignIn } from '@glw907/cairn-cms/auth';

// GET renders the confirm page (nothing consumed); the form POST verifies the token. siteName
// merges in from the admin layout load.
export const load: PageServerLoad = ({ url }) => ({
  token: url.searchParams.get('token') ?? '',
  error: url.searchParams.get('error'),
});

export const actions: Actions = {
  default: (event) => confirmSignIn(event),
};
