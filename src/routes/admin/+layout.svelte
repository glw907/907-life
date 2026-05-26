<script lang="ts">
  import { AdminLayout } from '@glw907/cairn-cms/components';

  let { data, children } = $props();
</script>

<AdminLayout {data}>{@render children()}</AdminLayout>
