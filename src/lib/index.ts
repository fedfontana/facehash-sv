// ============================================================================
// Primary Export - This is what you want
// ============================================================================

export { default as Facehash, type Intensity3D, type Variant } from './Facehash.svelte';
export type { FacehashProps } from './Facehash.svelte';

// ============================================================================
// Avatar Compound Components - For image + fallback pattern
// ============================================================================

export {
    Avatar,
    AvatarFallback,
    AvatarImage,
    getAvatarContext,
    type AvatarContextValue,
    type ImageLoadingStatus
} from './avatar/index.js';

// ============================================================================
// Face Components - For custom compositions
// ============================================================================

export {
    CrossFace,
    CurvedFace,
    FACES,
    type FaceComponent,
    type FaceProps,
    LineFace,
    RoundFace
} from './faces/index.js';

// ============================================================================
// Core - For advanced usage
// ============================================================================

export {
    computeFacehash,
    type ComputeFacehashOptions,
    DEFAULT_COLORS,
    FACE_TYPES,
    type FacehashData,
    type FaceType,
    getColor
} from './core/index.js';

// ============================================================================
// Utilities
// ============================================================================

export { stringHash } from './utils/hash.js';
