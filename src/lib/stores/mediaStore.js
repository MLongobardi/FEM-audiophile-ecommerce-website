import { readable, derived } from "svelte/store";
import { mediaQueries } from "$lib/myConfig.js";

/**@param {string} key */
function camelToKebab(key) {
	return key
		.split(/(?=[A-Z])/) //multipleWordKey => ["multiple", "Word", "Key"]
		.join("-") //["multiple", "Word", "Key"] => multiple-Word-Key
		.toLowerCase(); //multiple-Word-Key => multiple-word-key
}

const mQScreen = /**@type {Record<string, string>} */ (mediaQueries.screen);
const screenClassStrings = Object.fromEntries(
	Object.keys(mQScreen).map((key, i, arr) => [
		key,
		arr
			.map((el) => (mQScreen[el].includes("min-width") ? camelToKebab(el) : "")) //no class for the mobile media query (which is the default style, mobile-first)
			.slice(0, i + 1)
			.join(" ")
			.slice(1),
	])
);

/**@param {string} query */
function createSingleStore(query) {
	return readable(false, (set) => {
		let stop = () => {};

		if (typeof window != "undefined") {
			const mq = window.matchMedia(query);
			const update = () => set(mq.matches);
			update();
			mq.addEventListener("change", update);
			stop = () => {
				mq.removeEventListener("change", update);
			};
		}

		return stop;
	});
}

/**@param {Record<string, string>} queries */
function createGroupStore(queries) {
	/**@type {Record<string, ReturnType<typeof createSingleStore>>} */
	const storesObject = {};
	for (const [queryName, queryString] of Object.entries(queries)) {
		storesObject[queryName] = createSingleStore(queryString);
	}

	return derived(Object.values(storesObject), ($stores) => {
		/**@type {Record<string, boolean>} */
		const objectToReturn = {};
		Object.keys(queries).forEach((key, i) => {
			objectToReturn[key] = $stores[i];
		});

		return objectToReturn;
	});
}

const screenStore = createGroupStore(mediaQueries.screen);
const miscStore = createGroupStore(mediaQueries.misc);
const noPrintStore = createGroupStore(mediaQueries.noPrint);

const mediaStore = derived([screenStore, miscStore, noPrintStore], ([$screen, $misc, $noPrint]) => {
	const currentScreen = Object.keys($screen).find((key) => $screen[key] == true) || "";
	const miscClassString = Object.keys($misc)
		.filter((key) => $misc[key])
		.map(camelToKebab)
		.join(" ");

	return {
		/**@type {Record<keyof typeof mediaQueries.screen, boolean>}*/ screen: $screen,
		/**@type {Record<keyof typeof mediaQueries.misc, boolean>}*/ misc: $misc,
		/**@type {Record<keyof typeof mediaQueries.noPrint, boolean>}*/ noPrint: $noPrint,
		currentScreen: currentScreen,
		bodyClassList: screenClassStrings[currentScreen] + " " + miscClassString || "",
	};
});

export default mediaStore;
