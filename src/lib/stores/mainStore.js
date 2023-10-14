import { writable } from "svelte/store";

//store initial data
const startObject = {
	counter: 0,

	get counterSquared() {
		return this.counter * this.counter;
	},

	counterTimesN(n = 1) {
		return this.counter * n;
	},
};

//create writable and extract its subscribe and update methods
const { subscribe, update: u } = writable(startObject);

//global custom methods (accessible by components)
function incrementCounter() {
	u((draft) => {
		draft.counter++;
		return draft;
	});
}

function resetAfterN(n = 1000) {
	setTimeout(hiddenMethod, n);
}

//private custom methods (only accessible by other custom methods)
function hiddenMethod() {
	u((draft) => {
		draft.counter *= getZero();
		return draft;
	});
}

//helper functions
function getZero() {
	return 0;
}

//export custom store, without the private methods
export default {
	subscribe,
	incrementCounter,
	resetAfterN,
};
