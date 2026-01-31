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

/**
 * Light mode background colors (20% opacity feel)
 */
export const DEFAULT_COLORS_LIGHT = [
    '#fce7f3', // pink-100
    '#fef3c7', // amber-100
    '#dbeafe', // blue-100
    '#ffedd5', // orange-100
    '#d1fae5' // emerald-100
] as const;

/**
 * Dark mode background colors (90% opacity feel)
 */
export const DEFAULT_COLORS_DARK = [
    '#db2777', // pink-600
    '#d97706', // amber-600
    '#2563eb', // blue-600
    '#ea580c', // orange-600
    '#059669' // emerald-600
] as const;

export type ColorPalette = readonly string[] | string[];
