<script lang="ts">
	import { Search, X } from 'lucide-svelte';

	let { value = $bindable(''), placeholder = 'Search...' }: { value?: string; placeholder?: string } = $props();
</script>

<div class="relative">
	<div class="pointer-events-none absolute inset-y-0 left-3 flex items-center" style="color: var(--text-tertiary);">
		<Search size={18} />
	</div>
	<input
		type="search"
		bind:value
		{placeholder}
		class="w-full rounded-xl border py-3 pr-10 pl-10 text-sm outline-none transition-colors"
		style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
	/>
	{#if value}
		<button
			class="absolute inset-y-0 right-3 flex items-center"
			style="color: var(--text-tertiary);"
			onclick={() => (value = '')}
			aria-label="Clear search"
		>
			<X size={18} />
		</button>
	{/if}
</div>
