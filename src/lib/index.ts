export { default as Facehash, type Intensity3D, type Variant } from './Facehash.svelte';
export type { FacehashProps } from './Facehash.svelte';

export {
	Avatar,
	AvatarFallback,
	AvatarImage,
	getAvatarContext,
	type AvatarContextValue,
	type ImageLoadingStatus
} from './avatar/index.js';

export {
	CrossFace,
	CurvedFace,
	FACES,
	type FaceComponent,
	type FaceProps,
	LineFace,
	RoundFace
} from './faces/index.js';

export {
	computeFacehash,
	type ComputeFacehashOptions,
	FACE_TYPES,
	type FacehashData,
	type FaceType,
	getColor,
	stringHash,
	DEFAULT_COLORS
} from './core/index.js';
