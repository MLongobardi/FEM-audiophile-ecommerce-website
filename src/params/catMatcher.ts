import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
	return ["headphones", "speakers", "earphones"].includes(param);
};
