<script lang="ts">
  import { ConceptList } from '@glw907/cairn-cms/components';
  import type { ListData } from '@glw907/cairn-cms/sveltekit';

  let { data }: { data: ListData } = $props();
</script>

<ConceptList {data} />
