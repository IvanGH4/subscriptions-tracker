<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Component } from 'svelte';

	let {
		icon: Icon,
		title,
		message,
		ctaLabel,
		ctaHref
	}: {
		icon?: Component<{ size?: number }>;
		title: string;
		message: string;
		ctaLabel?: string;
		ctaHref?: string;
	} = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
	{#if Icon}
		<div class="mb-4" style="color: var(--text-tertiary);">
			<Icon size={48} />
		</div>
	{/if}
	<h2 class="mb-2 text-lg font-semibold" style="color: var(--text-primary);">{title}</h2>
	<p class="mb-6 text-sm" style="color: var(--text-secondary);">{message}</p>
	{#if ctaLabel && ctaHref}
		<a
			href={ctaHref}
			class="inline-flex items-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
		>
			{ctaLabel}
		</a>
	{/if}
</div>
