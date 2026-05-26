<script lang="ts">
  import { EditPage } from '@glw907/cairn-cms/components';
  import { cairn } from '$lib/cairn.config';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<EditPage {data} preview={cairn.preview} />
