<script lang="ts">
	import { Dialog } from "$comps";
	import { dialogStore } from "$stores";
</script>

<header>
	<h1>This is the header</h1>
	<p>And here is a button that opens a dialog box:</p>
	<button on:click={$dialogStore.TEST.open}>open dialog</button>
	<nav>
		<a href="/">Home</a>
		<a href="/headphones">Headphones</a>
		<a href="/headphones/test-product-1">Test product 1</a>
		<a href="/checkout">Checkout</a>
		<a href="/akjahk">Category error</a>
		<a href="/headphones/jsnkls">Product error</a>
		<a href="/fjfijf/test product 1">Product with category error</a>
		<a href="/nksjnsk/dkjnldss">Double error</a>
	</nav>
</header>

<Dialog name="TEST" easyClose>
	<div class="test-dialog">
		I'm a dialog!
		<button on:click={$dialogStore.TEST.close}>close dialog</button>
	</div>
</Dialog>

<style lang="scss">
	header {
		text-align: center;
	}

	.test-dialog {
		background: white;
		width: 600px;
        max-width: 95vw;
		height: 300px;
		border: black solid 3px;
	}

	:global(dialog):has(> .test-dialog) {
		border-radius: 30px;
	}
</style>