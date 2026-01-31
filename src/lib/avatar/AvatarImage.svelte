<!--
	AvatarImage - Image component that syncs its loading state with the Avatar context.
-->
<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { getAvatarContext, type ImageLoadingStatus } from './Avatar.svelte';

	interface Props extends Omit<HTMLImgAttributes, 'src'> {
		/**
		 * The image source URL. If empty or undefined, triggers error state.
		 */
		src?: string | null;

		/**
		 * Callback when the image loading status changes.
		 */
		onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
	}

	let {
		src,
		alt = '',
		class: className,
		style,
		onLoadingStatusChange,
		...restProps
	}: Props = $props();

	const ctx = getAvatarContext();

	function updateStatus(status: ImageLoadingStatus) {
		ctx.setImageLoadingStatus(status);
		onLoadingStatusChange?.(status);
	}

	$effect(() => {
		if (!src) {
			updateStatus('error');
			return;
		}

		let isMounted = true;
		const image = new Image();

		const setStatus = (status: ImageLoadingStatus) => {
			if (!isMounted) return;
			updateStatus(status);
		};

		setStatus('loading');

		image.onload = () => setStatus('loaded');
		image.onerror = () => setStatus('error');
		image.src = src;

		return () => {
			isMounted = false;
		};
	});
</script>

{#if ctx.imageLoadingStatus === 'loaded'}
	<img
		{alt}
		class={className}
		data-avatar-image=""
		src={src ?? undefined}
		style:aspect-ratio="1 / 1"
		style:width="100%"
		style:height="100%"
		style:object-fit="cover"
		{style}
		{...restProps}
	/>
{/if}
