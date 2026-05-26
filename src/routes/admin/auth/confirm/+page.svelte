<script lang="ts">
  import { ConfirmPage } from '@glw907/cairn-cms/components';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<ConfirmPage {data} />
