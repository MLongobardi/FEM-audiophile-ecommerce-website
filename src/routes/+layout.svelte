<script>
	import '../app.scss';
	import { Header, Footer, Loading } from "$comps";
	import { mediaStore } from "$stores";
    import { onMount } from "svelte";

	export let data;
	
	let loading = true;

    onMount(()=>{
        loading = false;
    })
</script>

<svelte:head>
	<title>Svelte template</title>
</svelte:head>

<div class="media-wrapper {$mediaStore.bodyClassList}">
	{#if loading}
		<Loading />
	{/if}
	
	<span class="top-hdr" />
	<Header />
	<span class="hdr-main" />
	categories: {JSON.stringify(data.categories)}
	<br>
	all products: {JSON.stringify(data.allProducts.map(p=>p.name))}
	<br>
	new products: {JSON.stringify(data.newProducts.map(p=>p.name))}
	<slot />
	<span class="main-ftr" />
	<Footer />
	<span class="ftr-btm" />
</div>

<style lang="scss">
	.media-wrapper {
		/*I can't add classes to the body in svelte, so this is a workaround*/
		display: contents;
	}
	
	.top-hdr,
	.ftr-btm {
		/*body is set to flex*/
		flex-basis: 10px;
		flex-grow: 1;
	}
	.hdr-main,
	.main-ftr {
		flex-basis: 25px;
		flex-grow: 3.5;
		
		:global(.des) & {
			flex-grow: 1.25;
		}
	}
</style>