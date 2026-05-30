<script lang="ts">
  // Bare passthrough. The admin shell (sidebar, user menu) wraps only the authed (app) group;
  // login and auth render without it.
  let { children } = $props();
</script>

{@render children()}
