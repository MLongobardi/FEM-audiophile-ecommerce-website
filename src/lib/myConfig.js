/**
 * mediaQueries.screen entries should go from smallest screen to biggest and in camelCase
 * The mobile one can't contain min-width, non-mobile ones must include it
 * $mediaStore.bodyClassList returns a list of css classes which consists of each key converted into kebab-case
 * For example, the largeTablet key becomes the large-tablet class
 * Properties under noPrint won't be present in bodyClassList
 */
export const mediaQueries = {
	screen: {
		mobile: "(max-width: 479px)",
		tablet: "(min-width: 480px) and (max-width: 767px)",
		largeTablet: "(min-width: 768px) and (max-width: 1199px)",
		desktop: "(min-width: 1200px)",
	},
	misc: {
		hoverable: "(hover: hover) and (pointer: fine)",
		prefersReducedMotion: "(prefers-reduced-motion: reduce)",
	},
	noPrint: {
		prefersLight: "(prefers-color-scheme: light)",
		prefersDark: "(prefers-color-scheme: dark",
	},
};