<script lang="ts">
	import { page } from "$app/stores";
</script>

{#if $page.url.pathname != "/checkout"}
	Above Footer
{/if}
<footer>
	<h2>This is the footer</h2>
</footer>