/**
 * SvelteKit adapter for Facehash image generation.
 *
 * @example
 * ```ts
 * // src/routes/api/avatar/+server.ts
 * import { toFacehashHandler } from 'facehash-sv/sveltekit';
 *
 * export const GET = toFacehashHandler();
 * ```
 *
 * @packageDocumentation
 */

// Re-export core types for convenience
export { DEFAULT_COLORS, type FacehashData, type FaceType, type Variant } from '../core/index.js';
export { type FacehashHandlerOptions, toFacehashHandler } from './handler.js';
