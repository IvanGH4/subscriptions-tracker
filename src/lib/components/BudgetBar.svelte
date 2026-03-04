<script lang="ts">
	import { formatCurrency } from '$lib/utils/currency';

	let { spent, budget, currency = 'USD' }: { spent: number; budget: number; currency?: string } = $props();

	let percentage = $derived(Math.min((spent / budget) * 100, 150));
	let barWidth = $derived(Math.min(percentage, 100));
	let status = $derived(
		percentage >= 100 ? 'over' : percentage >= 75 ? 'warning' : 'ok'
	);
	let barColor = $derived(
		status === 'over' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981'
	);
	let overAmount = $derived(spent > budget ? spent - budget : 0);
</script>

<section class="rounded-xl p-4" style="background-color: var(--card-bg); box-shadow: var(--card-shadow);">
	<div class="mb-2 flex items-center justify-between text-sm">
		<span style="color: var(--text-secondary);">Monthly Budget</span>
		<span style="color: var(--text-secondary);">
			{formatCurrency(spent, currency)} / {formatCurrency(budget, currency)}
		</span>
	</div>
	<div class="h-3 overflow-hidden rounded-full" style="background-color: var(--bg-tertiary);">
		<div
			class="h-full rounded-full transition-all duration-500"
			class:animate-pulse={status === 'over'}
			style="width: {barWidth}%; background-color: {barColor};"
		></div>
	</div>
	{#if status === 'over'}
		<p class="mt-2 text-sm font-medium text-red-500" role="alert" aria-live="polite">
			You're {formatCurrency(overAmount, currency)} over your {formatCurrency(budget, currency)}/mo budget
		</p>
	{/if}
</section>
