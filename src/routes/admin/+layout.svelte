<script lang="ts">
  import { AdminLayout } from 'cairn-cms/components';

  let { children } = $props();
</script>

<AdminLayout>{@render children()}</AdminLayout>
