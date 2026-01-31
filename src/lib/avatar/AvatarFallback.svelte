<!--
	AvatarFallback - Fallback component that displays when the image fails to load.
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getAvatarContext } from './Avatar.svelte';
	import Facehash from '../Facehash.svelte';
	import type { Intensity3D, Variant } from '../Facehash.svelte';

	const WHITESPACE_REGEX = /\s+/;

	interface FacehashProps {
		size?: number | string;
		variant?: Variant;
		intensity3d?: Intensity3D;
		interactive?: boolean;
		showInitial?: boolean;
		colors?: string[];
		colorClasses?: string[];
		gradientOverlayClass?: string;
	}

	interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
		/**
		 * The name to derive initials and Facehash from.
		 */
		name?: string;

		/**
		 * Delay in milliseconds before showing the fallback.
		 * Useful to prevent flashing when images load quickly.
		 * @default 0
		 */
		delayMs?: number;

		/**
		 * Custom children to render instead of initials or Facehash.
		 */
		children?: Snippet;

		/**
		 * Use the Facehash component as fallback instead of initials.
		 * @default true
		 */
		facehash?: boolean;

		/**
		 * Props to pass to the Facehash component.
		 */
		facehashProps?: FacehashProps;
	}

	let {
		name = '',
		delayMs = 0,
		children,
		facehash = true,
		facehashProps,
		class: className,
		style,
		...restProps
	}: Props = $props();

	const ctx = getAvatarContext();
	let delayComplete = $state(false);

	$effect(() => {
		if (delayMs === 0) {
			delayComplete = true;
			return;
		}

		delayComplete = false;
		const timerId = setTimeout(() => {
			delayComplete = true;
		}, delayMs);
		return () => clearTimeout(timerId);
	});

	let canRender = $derived(delayMs === 0 || delayComplete);

	/**
	 * Extracts initials from a name string.
	 */
	function getInitials(name: string): string {
		const parts = name.trim().split(WHITESPACE_REGEX);
		if (parts.length === 0) {
			return '';
		}
		if (parts.length === 1) {
			return parts[0]?.charAt(0).toUpperCase() || '';
		}

		const firstInitial = parts[0]?.charAt(0) || '';
		const lastInitial = parts.at(-1)?.charAt(0) || '';
		return (firstInitial + lastInitial).toUpperCase();
	}

	let initials = $derived(getInitials(name));
	let shouldRender = $derived(
		canRender && ctx.imageLoadingStatus !== 'loaded' && ctx.imageLoadingStatus !== 'loading'
	);
</script>

{#if shouldRender}
	{#if children}
		<span
			class={className}
			data-avatar-fallback=""
			style:display="flex"
			style:align-items="center"
			style:justify-content="center"
			style:width="100%"
			style:height="100%"
			{style}
			{...restProps}
		>
			{@render children()}
		</span>
	{:else if facehash}
		<Facehash
			class={className}
			data-avatar-fallback=""
			{name}
			size="100%"
			{...facehashProps}
			{style}
			{...restProps}
		/>
	{:else}
		<span
			class={className}
			data-avatar-fallback=""
			style:display="flex"
			style:align-items="center"
			style:justify-content="center"
			style:width="100%"
			style:height="100%"
			{style}
			{...restProps}
		>
			{initials}
		</span>
	{/if}
{/if}
