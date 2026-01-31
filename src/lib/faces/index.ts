import type { Component } from 'svelte';
import CrossFace from './CrossFace.svelte';
import CurvedFace from './CurvedFace.svelte';
import LineFace from './LineFace.svelte';
import RoundFace from './RoundFace.svelte';

export type FaceProps = {
	class?: string;
	style?: string;
};

export type FaceComponent = Component<FaceProps>;

/**
 * All available face components
 */
export const FACES: readonly FaceComponent[] = [
	RoundFace,
	CrossFace,
	LineFace,
	CurvedFace
] as const;

export { CrossFace, CurvedFace, LineFace, RoundFace };
