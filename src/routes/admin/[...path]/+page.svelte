<!--
@component
The single-mount admin page: CairnAdmin switches on data.view, so this one component renders
every /admin view. The adapter's render threads through for the editor's preview pane; 907 has
no directive registry or icon set, so only render is passed.
-->
<script lang="ts">
  import { CairnAdmin } from '@glw907/cairn-cms/components';
  import type { AdminData } from '@glw907/cairn-cms/sveltekit';
  import { cairn } from '$lib/cairn.config.js';
  import type { ActionData } from './$types';

  interface Props {
    /** The discriminated view data from the mount's load. */
    data: AdminData;
    /** The last action's result, forwarded to whichever view rendered. */
    form: ActionData;
  }

  let { data, form }: Props = $props();
</script>

<CairnAdmin {data} {form} render={cairn.render} />
