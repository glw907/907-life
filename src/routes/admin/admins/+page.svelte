<script lang="ts">
  import { ManageAdmins } from '@glw907/cairn-cms/components';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<ManageAdmins {data} />
