import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
	return ["test-product-1", "test-product-2", "test-product-3"].includes(param);
};
