import { DEFAULT_COLORS } from './colors.ts';
import { stringHash } from './hash.ts';

export type Variant = 'gradient' | 'solid';

export const FACE_TYPES = ['round', 'cross', 'line', 'curved'] as const;
export type FaceType = (typeof FACE_TYPES)[number];

export type FacehashData = {
	/** The face type to render */
	faceType: FaceType;
	/** Index into the colors array */
	colorIndex: number;
	/** Rotation position for 3D effect (-1, 0, or 1 for each axis) */
	rotation: { x: number; y: number };
	/** First letter of the name, uppercase */
	initial: string;
};

export type ComputeFacehashOptions = {
	/** String to generate face from */
	name: string;
	/** Number of colors available (for modulo) */
	colorsLength?: number;
};

const SPHERE_POSITIONS = [
	{ x: -1, y: 1 }, // down-right
	{ x: 1, y: 1 }, // up-right
	{ x: 1, y: 0 }, // up
	{ x: 0, y: 1 }, // right
	{ x: -1, y: 0 }, // down
	{ x: 0, y: 0 }, // center
	{ x: 0, y: -1 }, // left
	{ x: -1, y: -1 }, // down-left
	{ x: 1, y: -1 } // up-left
] as const;

/**
 * Computes deterministic face properties from a name string.
 * Pure function with no side effects or framework dependencies.
 */
export function computeFacehash(options: ComputeFacehashOptions): FacehashData {
	const { name, colorsLength = DEFAULT_COLORS.length } = options;

	const hash = stringHash(name);
	const faceIndex = hash % FACE_TYPES.length;
	const colorIndex = hash % colorsLength;
	const positionIndex = hash % SPHERE_POSITIONS.length;
	const position = SPHERE_POSITIONS[positionIndex] ?? { x: 0, y: 0 };

	return {
		faceType: FACE_TYPES[faceIndex] ?? 'round',
		colorIndex,
		rotation: position,
		initial: name.charAt(0).toUpperCase()
	};
}
