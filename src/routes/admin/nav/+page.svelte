<script lang="ts">
  import { NavTree } from '@glw907/cairn-cms/components';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<NavTree {data} />
