<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<SVGElement> {
		class?: string;
	}

	let { class: className, ...restProps }: Props = $props();
</script>

<svg
	aria-hidden="true"
	class={className}
	fill="none"
	viewBox="0 0 63 15"
	xmlns="http://www.w3.org/2000/svg"
	{...restProps}
>
	<title>Round Eyes</title>
	<path
		d="M62.4 7.2C62.4 11.1765 59.1765 14.4 55.2 14.4C51.2236 14.4 48 11.1765 48 7.2C48 3.22355 51.2236 0 55.2 0C59.1765 0 62.4 3.22355 62.4 7.2Z"
		fill="currentColor"
	/>
	<path
		d="M14.4 7.2C14.4 11.1765 11.1765 14.4 7.2 14.4C3.22355 14.4 0 11.1765 0 7.2C0 3.22355 3.22355 0 7.2 0C11.1765 0 14.4 3.22355 14.4 7.2Z"
		fill="currentColor"
	/>
</svg>
