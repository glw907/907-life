<script lang="ts">
  // Bare root layout. cairn-cms (0.33.0) requires the host root layout to be chrome-free so the
  // engine-owned /admin renders standalone without this site's nav, footer, width constraint, or
  // app.css around it. The public chrome and app.css live in the (site) route group, which is
  // URL-transparent, so public pages keep their paths. /admin and the endpoints sit outside the
  // group at the route root and inherit only this bare layout.
  let { children } = $props();
</script>

{@render children()}
