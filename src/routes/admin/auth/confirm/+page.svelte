<script lang="ts">
  import { ConfirmPage } from '@glw907/cairn-cms/components';

  let { data }: { data: { token: string; siteName: string; error: string | null } } = $props();
</script>

<ConfirmPage {data} />
