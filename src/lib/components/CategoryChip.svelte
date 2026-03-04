<script lang="ts">
	import { CATEGORY_META } from '$lib/constants';
	import type { Category } from '$lib/types';

	let {
		category,
		selected = false,
		onclick
	}: {
		category: Category;
		selected?: boolean;
		onclick?: () => void;
	} = $props();

	let meta = $derived(CATEGORY_META[category]);
</script>

<button
	type="button"
	class="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-all"
	style={selected
		? `background-color: ${meta.color}; color: white; border-color: ${meta.color};`
		: `background-color: var(--bg-secondary); color: var(--text-secondary); border-color: var(--border-color);`}
	{onclick}
>
	<span>{meta.emoji}</span>
	<span>{meta.label}</span>
</button>
