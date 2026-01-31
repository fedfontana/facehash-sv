import type { RequestHandler } from '@sveltejs/kit';
import { computeFacehash, getColor, type Variant } from '../core/index.js';
import { DEFAULT_COLORS } from '../core/colors.ts';
import { FACE_SVG_DATA } from './faces-svg.js';

export type FacehashHandlerOptions = {
	/**
	 * Default image size in pixels.
	 * Can be overridden via `?size=` query param.
	 * @default 400
	 */
	size?: number;

	/**
	 * Default background style.
	 * Can be overridden via `?variant=` query param.
	 * @default "gradient"
	 */
	variant?: Variant;

	/**
	 * Default for showing initial letter.
	 * Can be overridden via `?showInitial=` query param.
	 * @default true
	 */
	showInitial?: boolean;

	/**
	 * Default color palette (hex colors).
	 * Can be overridden via `?colors=` query param (comma-separated).
	 * @default ["#ec4899", "#f59e0b", "#3b82f6", "#f97316", "#10b981"]
	 */
	colors?: string[];

	/**
	 * Cache-Control header value.
	 * Set to `null` to disable caching.
	 * @default "public, max-age=31536000, immutable"
	 */
	cacheControl?: string | null;
};

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{3,8}$/;

function parseBoolean(value: string | null, defaultValue: boolean): boolean {
	if (value === null) {
		return defaultValue;
	}
	return value === 'true' || value === '1';
}

function parseNumber(value: string | null, defaultValue: number, min = 1, max = 2000): number {
	if (value === null) {
		return defaultValue;
	}
	const num = Number.parseInt(value, 10);
	if (Number.isNaN(num)) {
		return defaultValue;
	}
	return Math.min(Math.max(num, min), max);
}

function parseColors(value: string | null): string[] | undefined {
	if (!value) {
		return;
	}
	const colors = value
		.split(',')
		.map((c) => c.trim())
		.filter((c) => HEX_COLOR_REGEX.test(c));
	return colors.length > 0 ? colors : undefined;
}

function parseVariant(value: string | null): Variant | undefined {
	if (value === 'gradient' || value === 'solid') {
		return value;
	}
	return;
}

interface RenderOptions {
	size: number;
	backgroundColor: string;
	faceType: 'round' | 'cross' | 'line' | 'curved';
	initial: string;
	rotation: { x: number; y: number };
	variant: Variant;
	showInitial: boolean;
}

function generateSvg(options: RenderOptions): string {
	const { size, backgroundColor, faceType, initial, rotation, variant, showInitial } = options;
	const svgData = FACE_SVG_DATA[faceType];

	const [, , vbWidth, vbHeight] = svgData.viewBox.split(' ').map(Number);
	const aspectRatio = (vbWidth ?? 1) / (vbHeight ?? 1);

	const faceWidth = size * 0.6;
	const faceHeight = faceWidth / aspectRatio;

	const fontSize = size * 0.26;

	const offsetMagnitude = size * 0.05;
	const offsetX = rotation.y * offsetMagnitude;
	const offsetY = -rotation.x * offsetMagnitude;

	const paths = svgData.paths.map((d) => `<path d="${d}" fill="black"/>`).join('');

	const gradientOverlay =
		variant === 'gradient'
			? `<defs>
				<radialGradient id="grad" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
					<stop offset="60%" stop-color="transparent"/>
				</radialGradient>
			</defs>
			<rect width="${size}" height="${size}" fill="url(#grad)"/>`
			: '';

	const initialEl = showInitial
		? `<text 
				x="${size / 2 + offsetX}" 
				y="${size / 2 + faceHeight / 2 + fontSize * 0.8 + offsetY}" 
				text-anchor="middle" 
				font-family="monospace" 
				font-weight="bold" 
				font-size="${fontSize}" 
				fill="black"
			>${initial}</text>`
		: '';

	// Face SVG positioned in center with offset
	const faceX = (size - faceWidth) / 2 + offsetX;
	const faceY = (size - faceHeight) / 2 - (showInitial ? fontSize * 0.3 : 0) + offsetY;

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
		<rect width="${size}" height="${size}" fill="${backgroundColor}"/>
		${gradientOverlay}
		<svg x="${faceX}" y="${faceY}" width="${faceWidth}" height="${faceHeight}" viewBox="${svgData.viewBox}">
			${paths}
		</svg>
		${initialEl}
	</svg>`;
}

/**
 * Creates a SvelteKit request handler for generating Facehash avatar images.
 *
 * @example
 * ```ts
 * // src/routes/api/avatar/+server.ts
 * import { toFacehashHandler } from 'facehash-sv/sveltekit';
 *
 * export const GET = toFacehashHandler();
 * ```
 *
 * @example
 * ```ts
 * // With custom defaults
 * export const GET = toFacehashHandler({
 *   size: 200,
 *   variant: "solid",
 *   colors: ["#ff0000", "#00ff00", "#0000ff"],
 * });
 * ```
 *
 * Query parameters:
 * - `name` (required): String to generate avatar from
 * - `size`: Image size in pixels (default: 400)
 * - `variant`: "gradient" or "solid" (default: "gradient")
 * - `showInitial`: "true" or "false" (default: "true")
 * - `colors`: Comma-separated hex colors (e.g., "#ff0000,#00ff00")
 */
export function toFacehashHandler(options: FacehashHandlerOptions = {}): RequestHandler {
	const {
		size: defaultSize = 400,
		variant: defaultVariant = 'gradient',
		showInitial: defaultShowInitial = true,
		colors: defaultColors = [...DEFAULT_COLORS],
		cacheControl = 'public, max-age=31536000, immutable'
	} = options;

	const handler: RequestHandler = async ({ url }) => {
		const searchParams = url.searchParams;

		const name = searchParams.get('name');
		if (!name) {
			const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${defaultSize}" height="${defaultSize}" viewBox="0 0 ${defaultSize} ${defaultSize}">
				<rect width="${defaultSize}" height="${defaultSize}" fill="#f3f4f6"/>
				<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="24" fill="#6b7280">Missing ?name= parameter</text>
			</svg>`;

			return new Response(errorSvg, {
				status: 400,
				headers: {
					'Content-Type': 'image/svg+xml'
				}
			});
		}

		const size = parseNumber(searchParams.get('size'), defaultSize, 16, 2000);
		const variant = parseVariant(searchParams.get('variant')) ?? defaultVariant;
		const showInitial = parseBoolean(searchParams.get('showInitial'), defaultShowInitial);
		const colors = parseColors(searchParams.get('colors')) ?? defaultColors;

		const data = computeFacehash({
			name,
			colorsLength: colors.length
		});

		const backgroundColor = getColor(colors, data.colorIndex);

		const svg = generateSvg({
			size,
			backgroundColor,
			faceType: data.faceType,
			initial: data.initial,
			rotation: data.rotation,
			variant,
			showInitial
		});

		const headers: Record<string, string> = {
			'Content-Type': 'image/svg+xml'
		};

		if (cacheControl) {
			headers['Cache-Control'] = cacheControl;
		}

		return new Response(svg, { headers });
	};

	return handler;
}
