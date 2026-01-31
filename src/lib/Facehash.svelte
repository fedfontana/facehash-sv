<!--
	Facehash - Deterministic avatar faces from any string.
	Same string = same face. Always.
-->
<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	// ============================================================================
	// Types (exported from module context)
	// ============================================================================

	export type Intensity3D = 'none' | 'subtle' | 'medium' | 'dramatic';
	export type Variant = 'gradient' | 'solid';

	export interface FacehashProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/**
		 * String to generate a deterministic face from.
		 * Same string always produces the same face.
		 */
		name: string;

		/**
		 * Size in pixels or CSS units.
		 * @default 40
		 */
		size?: number | string;

		/**
		 * Background style.
		 * - "gradient": Adds gradient overlay (default)
		 * - "solid": Plain background color
		 * @default "gradient"
		 */
		variant?: Variant;

		/**
		 * 3D effect intensity.
		 * @default "dramatic"
		 */
		intensity3d?: Intensity3D;

		/**
		 * Enable hover interaction.
		 * When true, face "looks straight" on hover.
		 * @default true
		 */
		interactive?: boolean;

		/**
		 * Show first letter of name below the face.
		 * @default true
		 */
		showInitial?: boolean;

		/**
		 * Hex color array for inline styles.
		 * Use this OR colorClasses, not both.
		 */
		colors?: string[];

		/**
		 * Tailwind class array for background colors.
		 * Example: ["bg-pink-500 dark:bg-pink-600", "bg-blue-500 dark:bg-blue-600"]
		 * Use this OR colors, not both.
		 */
		colorClasses?: string[];

		/**
		 * Custom gradient overlay class (Tailwind).
		 * When provided, replaces the default pure CSS gradient.
		 * Only used when variant="gradient".
		 */
		gradientOverlayClass?: string;
	}
</script>

<script lang="ts">
	import { FACES } from './faces/index.js';
	import { stringHash } from './utils/hash.js';
	import { DEFAULT_COLORS, getColor } from './core/index.js';

	// ============================================================================
	// Constants
	// ============================================================================

	const INTENSITY_PRESETS = {
		none: {
			rotateRange: 0,
			translateZ: 0,
			perspective: 'none'
		},
		subtle: {
			rotateRange: 5,
			translateZ: 4,
			perspective: '800px'
		},
		medium: {
			rotateRange: 10,
			translateZ: 8,
			perspective: '500px'
		},
		dramatic: {
			rotateRange: 15,
			translateZ: 12,
			perspective: '300px'
		}
	} as const;

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

	// ============================================================================
	// Props & State
	// ============================================================================

	let {
		name,
		size = 40,
		variant = 'gradient',
		intensity3d = 'dramatic',
		interactive = true,
		showInitial = true,
		colors,
		colorClasses,
		gradientOverlayClass,
		class: className,
		style,
		...restProps
	}: FacehashProps = $props();

	let isHovered = $state(false);

	// ============================================================================
	// Derived Values
	// ============================================================================

	// Resolve colors with default fallback
	let resolvedColors = $derived(colors && colors.length > 0 ? colors : [...DEFAULT_COLORS]);

	// Generate deterministic values from name
	let faceData = $derived.by(() => {
		const hash = stringHash(name);
		const faceIndex = hash % FACES.length;
		const colorsLength = colorClasses?.length ?? resolvedColors.length;
		const _colorIndex = hash % colorsLength;
		const positionIndex = hash % SPHERE_POSITIONS.length;
		const position = SPHERE_POSITIONS[positionIndex] ?? { x: 0, y: 0 };

		return {
			FaceComponent: FACES[faceIndex] ?? FACES[0],
			colorIndex: _colorIndex,
			rotation: position
		};
	});

	// Get intensity preset
	let preset = $derived(INTENSITY_PRESETS[intensity3d]);

	// Calculate 3D transform
	let transform = $derived.by(() => {
		if (intensity3d === 'none') {
			return undefined;
		}

		const rotateX = isHovered && interactive ? 0 : faceData.rotation.x * preset.rotateRange;
		const rotateY = isHovered && interactive ? 0 : faceData.rotation.y * preset.rotateRange;

		return `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${preset.translateZ}px)`;
	});

	// Size style
	let sizeValue = $derived(typeof size === 'number' ? `${size}px` : size);

	// Initial letter
	let initial = $derived(name.charAt(0).toUpperCase());

	// Background: either hex color (inline) or class
	let bgColorClass = $derived(colorClasses?.[faceData.colorIndex]);
	let bgColorHex = $derived(colorClasses ? undefined : resolvedColors[faceData.colorIndex]);

	// Combined class names
	let combinedClass = $derived([bgColorClass, className].filter(Boolean).join(' '));

	// ============================================================================
	// Event Handlers
	// ============================================================================

	function handleMouseEnter() {
		if (interactive) {
			isHovered = true;
		}
	}

	function handleMouseLeave() {
		if (interactive) {
			isHovered = false;
		}
	}
</script>

<div
	class={combinedClass || undefined}
	data-facehash=""
	data-interactive={interactive || undefined}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	style:width={sizeValue}
	style:height={sizeValue}
	style:position="relative"
	style:display="flex"
	style:align-items="center"
	style:justify-content="center"
	style:overflow="hidden"
	style:container-type="size"
	style:perspective={intensity3d !== 'none' ? preset.perspective : undefined}
	style:transform-style={intensity3d !== 'none' ? 'preserve-3d' : undefined}
	style:background-color={bgColorHex && !bgColorClass ? bgColorHex : undefined}
	{style}
	{...restProps}
>
	<!-- Gradient overlay -->
	{#if variant === 'gradient'}
		<div
			class={gradientOverlayClass}
			data-facehash-gradient=""
			style:position="absolute"
			style:inset="0"
			style:pointer-events="none"
			style:z-index="1"
			style:background={gradientOverlayClass
				? undefined
				: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)'}
		></div>
	{/if}

	<!-- Face container with 3D transform -->
	<div
		data-facehash-face=""
		style:position="absolute"
		style:inset="0"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
		style:justify-content="center"
		style:z-index="2"
		style:transform
		style:transform-style={intensity3d !== 'none' ? 'preserve-3d' : undefined}
		style:transition={interactive ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : undefined}
		style:color="#000000"
	>
		<!-- Face SVG -->
		<faceData.FaceComponent style="width: 60%; height: auto; max-width: 90%; max-height: 40%;" />

		<!-- Initial letter -->
		{#if showInitial}
			<span
				data-facehash-initial=""
				style:margin-top="8%"
				style:font-size="26cqw"
				style:line-height="1"
				style:font-family="monospace"
				style:font-weight="bold"
			>
				{initial}
			</span>
		{/if}
	</div>
</div>
