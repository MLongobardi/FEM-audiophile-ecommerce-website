<script>
	// @ts-nocheck
	/**
	 * When using this component, if you want to declare the dropButtons prop in the script tag, you need to make it reactive.
	 * Or else disabled won't work.
	 */

	export let dropButtons = [
		{
			text: "Hello",
			func: () => {
				console.log("Hello");
			},
		},
		{
			text: "World",
			func: () => {
				console.log("World");
			},
		},
		{
			text: "Disabled",
			func: () => {
				console.log("How?");
			},
			disabled: true,
		},
	];
</script>

<div class="dropdown-holder">
	<button class="open-dropdown">
		<slot>Open</slot>
	</button>
	<div class="dropdown">
		{#each dropButtons as b}
			<button
				class="dropdown-button"
				on:click={() => {
					if (!b.disabled) b.func();
				}}
				on:click={function () {
					this.blur();
				}}
				disabled={b.disabled}
			>
				{b.text}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	// :where() is used to reduce specificity, but svelte adds a class to scope styles to a component

	:where(.dropdown-holder) {
		position: relative;
		box-sizing: border-box;
	}
	:where(.dropdown) {
		--width: 150px;
		--offset: 10px;
		padding: 0 !important;
		display: none;
		width: var(--width);
		position: absolute;
		z-index: 2;
		background: white;
		border: solid 1px #e8e8e8;
		border-radius: 0 0 8px 8px;
		overflow: hidden;
		top: calc(100% + var(--offset));
		left: calc(50% - var(--width) / 2);
	}

	:where(.dropdown-holder:focus-within .dropdown) {
		display: block;
	}

	:where(.dropdown-button) {
		background: white;
		width: 100%;
		margin: 0;
	}
	:where(.dropdown-button:disabled) {
		opacity: 0.3;
	}
	:where(.dropdown-button:first-of-type) {
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
	}
	:where(.dropdown-button:last-of-type) {
		border-bottom-left-radius: inherit;
		border-bottom-right-radius: inherit;
	}
	:where(.dropdown-button:not(:focus-visible)) {
		border-color: transparent;
	}
	:where(:global(.hoverable) .dropdown-button:hover) {
		background: #e8e8e8;
	}
</style>
