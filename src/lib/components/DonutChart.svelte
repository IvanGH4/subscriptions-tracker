<script lang="ts">
	import { CATEGORY_META } from '$lib/constants';
	import { formatCurrency } from '$lib/utils/currency';
	import type { Category } from '$lib/types';

	let {
		segments,
		currency = 'USD',
		onSegmentClick
	}: {
		segments: { category: Category; amount: number }[];
		currency?: string;
		onSegmentClick?: (category: Category) => void;
	} = $props();

	const SIZE = 160;
	const STROKE = 28;
	const RADIUS = (SIZE - STROKE) / 2;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

	let total = $derived(segments.reduce((sum, s) => sum + s.amount, 0));

	let arcs = $derived.by(() => {
		if (total === 0) return [];
		let offset = 0;
		return segments
			.filter((s) => s.amount > 0)
			.map((s) => {
				const pct = s.amount / total;
				const dashLength = pct * CIRCUMFERENCE;
				const dashOffset = -offset;
				offset += dashLength;
				return {
					category: s.category,
					amount: s.amount,
					pct,
					dashArray: `${dashLength} ${CIRCUMFERENCE - dashLength}`,
					dashOffset,
					color: CATEGORY_META[s.category].color,
					emoji: CATEGORY_META[s.category].emoji,
					label: CATEGORY_META[s.category].label
				};
			});
	});
</script>

<div class="flex flex-col items-center gap-4">
	<svg
		width={SIZE}
		height={SIZE}
		viewBox="0 0 {SIZE} {SIZE}"
		role="img"
		aria-label="Spending by category"
	>
		{#if arcs.length === 0}
			<circle
				cx={SIZE / 2}
				cy={SIZE / 2}
				r={RADIUS}
				fill="none"
				stroke="var(--bg-tertiary)"
				stroke-width={STROKE}
			/>
		{/if}
		{#each arcs as arc}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<circle
				cx={SIZE / 2}
				cy={SIZE / 2}
				r={RADIUS}
				fill="none"
				stroke={arc.color}
				stroke-width={STROKE}
				stroke-dasharray={arc.dashArray}
				stroke-dashoffset={arc.dashOffset}
				transform="rotate(-90 {SIZE / 2} {SIZE / 2})"
				class="cursor-pointer transition-opacity hover:opacity-80"
				role="button"
				tabindex="0"
				aria-label="{arc.label}: {formatCurrency(arc.amount, currency)}"
				onclick={() => onSegmentClick?.(arc.category)}
			/>
		{/each}
		<text
			x={SIZE / 2}
			y={SIZE / 2 - 6}
			text-anchor="middle"
			class="text-xs"
			fill="var(--text-secondary)"
		>
			Total
		</text>
		<text
			x={SIZE / 2}
			y={SIZE / 2 + 14}
			text-anchor="middle"
			class="text-sm font-semibold"
			fill="var(--text-primary)"
		>
			{formatCurrency(total, currency)}
		</text>
	</svg>

	{#if arcs.length > 0}
		<div class="grid w-full grid-cols-2 gap-x-4 gap-y-1 text-sm">
			{#each arcs as arc}
				<button
					class="flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors hover:opacity-80"
					style="color: var(--text-secondary);"
					onclick={() => onSegmentClick?.(arc.category)}
				>
					<span
						class="inline-block h-3 w-3 rounded-full"
						style="background-color: {arc.color};"
					></span>
					<span class="truncate">{arc.emoji} {arc.label}</span>
					<span class="ml-auto font-medium" style="color: var(--text-primary);">
						{Math.round(arc.pct * 100)}%
					</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
