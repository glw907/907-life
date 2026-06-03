import { content } from '$lib/cairn.server.js';

export const load = content.editLoad;
export const actions = { save: content.saveAction, delete: content.deleteAction, rename: content.renameAction };
