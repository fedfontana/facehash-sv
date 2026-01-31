<!--
	Avatar - Root component that provides context for image loading state.
-->
<script lang="ts" module>
	import { getContext, setContext } from 'svelte';

	const AVATAR_CONTEXT_KEY = Symbol('avatar-context');

	export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

	export type AvatarContextValue = {
		imageLoadingStatus: ImageLoadingStatus;
		setImageLoadingStatus: (status: ImageLoadingStatus) => void;
	};

	/**
	 * Hook to access the Avatar context.
	 * Throws an error if used outside of Avatar.
	 */
	export function getAvatarContext(): AvatarContextValue {
		const context = getContext<AvatarContextValue>(AVATAR_CONTEXT_KEY);
		if (!context) {
			throw new Error('Avatar compound components must be rendered within an Avatar component');
		}
		return context;
	}

	export function setAvatarContext(value: AvatarContextValue) {
		setContext(AVATAR_CONTEXT_KEY, value);
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		children?: Snippet;
	}

	let { children, class: className, style, ...restProps }: Props = $props();

	let imageLoadingStatus = $state<ImageLoadingStatus>('idle');

	setAvatarContext({
		get imageLoadingStatus() {
			return imageLoadingStatus;
		},
		setImageLoadingStatus: (status: ImageLoadingStatus) => {
			imageLoadingStatus = status;
		}
	});
</script>

<span
	class={className}
	data-avatar=""
	data-state={imageLoadingStatus}
	style:position="relative"
	style:display="flex"
	style:align-items="center"
	style:justify-content="center"
	style:flex-shrink="0"
	style:overflow="hidden"
	{style}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</span>
