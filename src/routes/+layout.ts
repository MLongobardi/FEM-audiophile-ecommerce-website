import data from "$lib/assets/data.json";

export function load() {
	const categories: string[] = [];
	data.forEach((product) => {
		if (!categories.includes(product.category)) {
			categories.push(product.category);
		}
	});
	return {
		categories: categories,
		allProducts: data,
		newProducts: data.filter((p) => p.new),
	};
}
