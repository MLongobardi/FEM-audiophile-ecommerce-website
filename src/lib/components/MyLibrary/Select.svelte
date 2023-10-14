<script>
	// @ts-nocheck
	import { onMount } from "svelte";
	import { mediaStore } from "$stores";

	/**
	 * Creates a native select element, and if the user is using a mouse, covers it with a custom element (with an aria-hidden attribute).
	 * The two elements are synchronized: when an option is selected on one, it is also selected on the other.
	 * The custom element and the select element are styled to look the same, so that a transition between the two isn't noticeable.
	 * The custom element isn't selectable with tab, but the hidden select is. When the select is focused, the custom element shows an outline as if it was the focused element.
	 * When the custom element is focused, it passes the focus to the hidden select, so that the native keyboard behavior works.
	 *
	 * Contrary to the native select, the custom one's dropdown list CAN be styled.
	 */

	export let options = [
		{ value: "1", label: "One" },
		{ value: "2", label: "Two" },
		{ value: "3", label: "Three" },
	];
	export let name;
	export let chevron = true;
	export let initial = 0;

	let select;
	let holder;
	let holderWidth;
	let holderHeight;
	let holderFromTop = 0;
	let value = options[initial].value; //initialized to first value
	$: selectedId = options.findIndex((o) => o.value == value);
	let showDropdown = false;
	let lastHovered = null;

	function updateFromTop() {
		holderFromTop = holder?.getBoundingClientRect().top ?? 0;
	}

	function openDropdown() {
		if (showDropdown) return;
		lastHovered = null;
		showDropdown = true;
		updateFromTop();
		window.addEventListener("scroll", updateFromTop, true)
		document.addEventListener("pointerup", handlePointerUp);
	}
	function handlePointerUp(e) {
		if (!showDropdown) document.removeEventListener("pointerup", handlePointerUp);
		if (!e.target.matches(":is(.my-select, .my-select *, .option, .option *)")) {
			closeDropdown();
		}
	}
	function closeDropdown() {
		window.removeEventListener("scroll", updateFromTop);
		document.removeEventListener("pointerup", handlePointerUp);
		showDropdown = false;
		lastHovered = null;
		select.blur();
	}

	onMount(() => {
		//onDestroy sometimes gets stuck with saying document is not defined;
		return () => {
			window.removeEventListener("scroll", updateFromTop);
			document.removeEventListener("pointerup", handlePointerUp);
		};
	});
</script>

<div class="my-select-wrapper" class:sr-only={$mediaStore.misc.hoverable} class:chevron>
	<select
		class="my-select"
		{name}
		bind:value
		bind:this={select}
		on:change={() => {
			lastHovered = null;
		}}
		on:keydown={(e) => {
			if ($mediaStore.misc.hoverable) {
				let action = () => {};
				if (showDropdown && e.key == "Enter") action = closeDropdown;
				if (e.key == " " || e.key == "Enter") {
					e.preventDefault();
					if (!showDropdown) action = openDropdown;
				}
				action();
			}
		}}
	>
		{#each options as o}
			<option value={o.value}>{o.label}</option>
		{/each}
	</select>
</div>
{#if $mediaStore.misc.hoverable}
	<div
		class="my-select-wrapper"
		class:chevron
		aria-hidden="true"
		bind:this={holder}
		bind:clientWidth={holderWidth}
		bind:clientHeight={holderHeight}
	>
		<button
			class="my-select"
			tabindex="-1"
			type="button"
			on:click={openDropdown}
			on:focus={() => {
				select.focus();
			}}
		>
			{options[selectedId].label}
		</button>
		{#if showDropdown}
			<div
				class="options-holder"
				style:--parentWidth={holderWidth + "px"}
				style:--parentHeight={holderHeight + "px"}
				style:--fromTop={holderFromTop + "px"}
				on:focusout={function (e) {
					//not using an arrow function lets me use the "this" keyword
					if (!this.contains(e.relatedTarget)) closeDropdown();
				}}
			>
				{#each options as o, i}
					<button
						class="option"
						class:highlighted={i == (lastHovered ?? selectedId)}
						type="button"
						on:click={() => {
							//also triggers when pressing Enter while having focus
							value = options[i].value;
							lastHovered = null;
							closeDropdown();
							holder.dispatchEvent(new CustomEvent("change", { bubbles: true }));
						}}
						on:mouseover={() => {
							lastHovered = i;
						}}
						on:focus={() => {
							lastHovered = i;
						}}
					>
						{o.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.my-select-wrapper {
		display: inline-block;
		position: relative;
		width: 100%;
		--bg: var(--background-color, white);
		--out: var(--input-outline, black);
		--pad: var(--input-padding, 5px);
		--brd: var(--input-border, solid 1px black);
	}
	.my-select-wrapper.chevron::after {
		content: "";
		display: inline-block;
		height: 0.4em;
		width: 0.4em;
		border-style: solid;
		border-width: 2px 2px 0 0;
		position: absolute;
		top: calc(50% - 0.3em);
		right: 0.5em;
		pointer-events: none;
		transform: rotate(135deg);
	}

	.my-select {
		appearance: none;
		margin: 0;
		border-radius: 4px;
		background: var(--bg);
		color: black;
		width: 100%;
		box-sizing: border-box;
		text-align: start;
		padding: var(--pad);
		position: relative;
		border: var(--brd);
	}
	.my-select::-ms-expand {
		display: none; /* IE */
	}
	:global(*):has(> .my-select-wrapper .my-select:is(:focus, :focus-visible)) .my-select {
		background: var(--bg);
		border: var(--brd);
		outline: solid 1px var(--out);
	}

	.options-holder {
		//position: absolute;
		//top: calc(100% + 10px);
		position: fixed; //absolute doesn't work because it doesn't overflow
		--offset: 10px;
		width: var(--parentWidth); //set with js because of position: fixed;
		top: calc(var(--offset) + var(--parentHeight) + var(--fromTop));
		border-radius: 8px;
		background: var(--bg);
		z-index: 1;
		max-height: 120px;
		overflow-x: visible;
		overflow-y: auto;
	}

	.option {
		display: block;
		background: var(--bg);
		border: none;
		outline: 0;
		padding: var(--input-padding);
		margin: 0;
		width: 100%;
		text-align: start;
		user-select: none;
		color: inherit;
	}
	.option.highlighted {
		background: dodgerblue;
	}

	.sr-only {
		@extend %screen-reader-only;
	}
</style>
