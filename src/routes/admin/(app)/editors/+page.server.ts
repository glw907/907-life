import { editors } from '$lib/cairn.server.js';

export const load = editors.editorsLoad;
export const actions = {
  add: editors.addEditorAction,
  remove: editors.removeEditorAction,
  setRole: editors.setRoleAction,
};
