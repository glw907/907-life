<script lang="ts">
  import { CollectionList } from '@glw907/cairn-cms/components';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<CollectionList {data} />
