import { writable } from "svelte/store";

//store initial data
/**@type {Record<Uppercase<string>,{open: () => void, close: () => void}>} */
const startObject = {};

//create writable and extract its subscribe and update methods
const { subscribe, update: u } = writable(startObject);

//global custom methods (accessible by components)
/**
 * @param {Uppercase<string>} name
 * @param {{myShowModal: Function, myClose: Function}} instance
 */
function addInstance(name, instance) {
	u((draft) => {
		draft[name] = {
			open() {
				instance.myShowModal();
			},
			close() {
				instance.myClose();
			},
		};
		return draft;
	});
}

/**@param {Uppercase<string>} name */
function removeInstance(name) {
	u((draft) => {
		delete draft[name];
		return draft;
	});
}

//export custom store, without the private methods
export default {
	subscribe,
	addInstance,
	removeInstance,
};
