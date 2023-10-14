<script>
	// @ts-nocheck
	import { onMount, onDestroy } from "svelte";
	import { dialogStore, mediaStore } from "$stores";
	import { scale } from "svelte/transition";

	/**
	 * <Dialog name="DIALOG_NAME" let:inTransition>
	 *		//dialog content here, all of it must be inside a single div
	 *		//it can optionally have the in:inTransition directive
	 * </Dialog>
	 *
	 * Then, anywhere you need it, import dialogStore and call
	 * $dialogStore.DIALOG_NAME.open()
	 * to show the modal, or
	 * $dialogStore.DIALOG_NAME.close()
	 * to close it
	 *
	 * A Dialog instance won't be added to the dialogStore if it isn't given a name prop.
	 *
	 * The dialog's content will only be printed when the dialog is open.
	 *
	 * The dialog backdrop doesn't inherit anything, so it can only use css variables declared in ::backdrop
	 *
	 * width, height and border-radius should be applied to the dialog itself, you can target it inside another component with:
	 * :global(dialog):has(> .name-of-content-div) {}
	 */

	export let name;
	export let startOpen = false;
	export let easyClose = !startOpen;
	export let onOpen = false;
	export let onClose = false;
	export let onEasyClose = easyClose ? onClose : false;

	let dialog;
	let showContent = false;
	let timeout;
	let canInteract = false;

	function reducedScale(node, options) {
		//sets some default options
		if (Object.keys(options).length == 0) options = { delay: 100, start: 0.8, duration: 300 };
		if (!$mediaStore.misc.prefersReducedMotion) return scale(node, options);
	}

	onMount(() => {
		dialog.myShowModal = () => {
			if (dialog.open) return;
			if (typeof onOpen == "function") onOpen();
			showContent = true;
			timeout = setTimeout(() => {
				canInteract = true;
			}, 200);
			dialog.showModal();
		};
		dialog.myClose = (mode) => {
			if (!dialog.open) return;
			if (mode == "easy" && typeof onEasyClose == "function") onEasyClose();
			if (mode != "easy" && typeof onClose == "function") onClose();
			showContent = false;
			clearTimeout(timeout);
			canInteract = false;
			dialog.close();
		};

		if (startOpen) {
			showContent = true;
			dialog.showModal();
		}

		if (name) dialogStore.addInstance(name, dialog);
	});

	onDestroy(() => {
		if (name) dialogStore.removeInstance(name);
		clearTimeout(timeout);
	});

	function handlePointDown(e) {
		if (!easyClose) return;
		/**
		 * on:pointerdown|self fires when clicking on the backdrop (so long as the dialog has padding: 0),
		 * so clicking inside the dialog, dragging on the backdrop and releasing the click
		 * DOESN'T close the dialog
		 */
		if (e.pointerType == "touch") {
			dialog.addEventListener(
				"touchend",
				(e) => {
					let endTouch = e.changedTouches[0];
					let endTarget = document.elementFromPoint(endTouch.clientX, endTouch.clientY);
					if (endTarget == dialog) dialog.myClose("easy");
					e.preventDefault();
				},
				{ once: true }
			);
		} else {
			dialog.addEventListener(
				"pointerup",
				(e) => {
					if (e.target == dialog && e.button == 0) dialog.myClose("easy");
				},
				{ once: true }
			);
		}
	}
</script>

<dialog bind:this={dialog} on:pointerdown|self={handlePointDown} class:opening={!canInteract}>
	{#if showContent}
		<slot inTransition={reducedScale}>
			<div in:reducedScale>
				Empty Dialog!
				<button
					on:click={() => {
						dialog.myClose();
					}}>Close</button
				>
			</div>
		</slot>
	{/if}
</dialog>

<style lang="scss">
	dialog {
		padding: 0 !important; /*needed for correct event handling*/
		border: none;
		max-width: unset;
		max-height: unset;
		overflow: visible; //allows, for example, a close button to overflow
		color: inherit;
		background: transparent;
	}
	dialog::backdrop {
		animation: fade-in 300ms forwards;
	}
	dialog.opening,
	dialog.opening::backdrop {
		pointer-events: none;
	}

	dialog > :global(div) {
		margin: 0 !important; /*needed for correct event handling*/
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		border-radius: inherit;
	}

	:global(body):has(dialog[open]) {
		overflow: hidden;
	}

	@keyframes fade-in {
		from {
			backdrop-filter: blur(0);
			opacity: 0;
		}
		to {
			backdrop-filter: blur(2px);
			opacity: 1;
		}
	}
</style>