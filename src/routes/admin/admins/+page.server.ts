import type { PageServerLoad, Actions } from './$types';
import { adminsLoad, addAdmin, removeAdmin, setAdminRole } from '@glw907/cairn-cms/auth';

export const load: PageServerLoad = (event) => adminsLoad(event);

export const actions: Actions = {
  add: (event) => addAdmin(event),
  remove: (event) => removeAdmin(event),
  setRole: (event) => setAdminRole(event),
};
