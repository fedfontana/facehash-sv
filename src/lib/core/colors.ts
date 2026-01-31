/**
 * Default color palette using Tailwind CSS color values.
 * These colors work well in both light and dark modes.
 */
export const DEFAULT_COLORS = [
	'#ec4899', // pink-500
	'#f59e0b', // amber-500
	'#3b82f6', // blue-500
	'#f97316', // orange-500
	'#10b981' // emerald-500
] as const;

export type ColorPalette = readonly string[] | string[];

/**
 * Gets a color from an array by index, with fallback to default colors.
 */
export function getColor(colors: ColorPalette | undefined, index: number): string {
	const palette = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
	return palette[index % palette.length] ?? DEFAULT_COLORS[0];
}
