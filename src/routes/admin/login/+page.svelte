<script lang="ts">
  import { LoginPage } from 'cairn-cms/components';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<LoginPage {data} />
