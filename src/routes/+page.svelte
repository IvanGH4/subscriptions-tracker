<script lang="ts">
	import { subscriptionStore } from '$lib/stores/subscriptions.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { getTotalMonthly, getTotalYearly, toMonthly } from '$lib/utils/billing';
	import { formatCurrency } from '$lib/utils/currency';
	import { daysUntil } from '$lib/utils/dates';
	import { CATEGORY_META } from '$lib/constants';
	import CountUp from '$lib/components/CountUp.svelte';
	import BudgetBar from '$lib/components/BudgetBar.svelte';
	import DonutChart from '$lib/components/DonutChart.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { Inbox } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { Category } from '$lib/types';

	let subs = $derived(subscriptionStore.items);
	let settings = $derived(settingsStore.current);
	let activeSubs = $derived(subs.filter((s) => !s.isPaused));
	let monthly = $derived(getTotalMonthly(subs));
	let yearly = $derived(getTotalYearly(subs));

	let upcoming = $derived(
		[...activeSubs]
			.filter((s) => {
				const d = daysUntil(s.nextBillingDate);
				return d >= 0 && d <= 7;
			})
			.sort((a, b) => daysUntil(a.nextBillingDate) - daysUntil(b.nextBillingDate))
			.slice(0, 5)
	);

	let categorySegments = $derived.by(() => {
		const map = new Map<Category, number>();
		for (const sub of activeSubs) {
			const m = toMonthly(sub.amount, sub.cycle);
			map.set(sub.category, (map.get(sub.category) || 0) + m);
		}
		return Array.from(map.entries())
			.map(([category, amount]) => ({ category, amount }))
			.sort((a, b) => b.amount - a.amount);
	});

	let avgCost = $derived(activeSubs.length > 0 ? monthly / activeSubs.length : 0);
	let mostExpensive = $derived(
		activeSubs.length > 0
			? [...activeSubs].sort((a, b) => toMonthly(b.amount, b.cycle) - toMonthly(a.amount, a.cycle))[0]
			: null
	);

	function currencyFormatter(n: number): string {
		return formatCurrency(n, settings.currency);
	}

	function handleSegmentClick(category: Category) {
		goto(`/subscriptions?category=${category}`);
	}
</script>

<svelte:head>
	<title>Dashboard — SubTracker</title>
</svelte:head>

<div class="px-4 pt-6">
	<h1 class="mb-6 text-2xl font-bold" style="color: var(--text-primary);">Dashboard</h1>

	{#if subs.length === 0}
		<EmptyState
			icon={Inbox}
			title="No subscriptions yet"
			message="Start tracking your recurring payments to see spending insights."
			ctaLabel="Add your first subscription"
			ctaHref="/subscriptions/new"
		/>
	{:else}
		<!-- Totals -->
		<section class="mb-6 grid grid-cols-2 gap-3">
			<div class="rounded-xl p-4" style="background-color: var(--card-bg); box-shadow: var(--card-shadow);">
				<div class="text-sm" style="color: var(--text-secondary);">Monthly</div>
				<div class="text-2xl font-bold text-brand-500">
					<CountUp value={monthly} formatter={currencyFormatter} />
				</div>
			</div>
			<div class="rounded-xl p-4" style="background-color: var(--card-bg); box-shadow: var(--card-shadow);">
				<div class="text-sm" style="color: var(--text-secondary);">Yearly</div>
				<div class="text-2xl font-bold text-brand-500">
					<CountUp value={yearly} formatter={currencyFormatter} />
				</div>
			</div>
		</section>

		<!-- Budget -->
		{#if settings.monthlyBudget}
			<div class="mb-6">
				<BudgetBar spent={monthly} budget={settings.monthlyBudget} currency={settings.currency} />
			</div>
		{/if}

		<!-- Upcoming Renewals -->
		{#if upcoming.length > 0}
			<section class="mb-6">
				<h2 class="mb-3 text-base font-semibold" style="color: var(--text-primary);">Upcoming Renewals</h2>
				<div class="flex flex-col gap-2">
					{#each upcoming as sub}
						{@const days = daysUntil(sub.nextBillingDate)}
						<a
							href="/subscriptions/{sub.id}/edit"
							class="flex items-center gap-3 rounded-xl p-3 transition-colors"
							style="background-color: var(--card-bg); box-shadow: var(--card-shadow);"
						>
							<span class="text-lg">{sub.icon || CATEGORY_META[sub.category].emoji}</span>
							<span class="flex-1 truncate text-sm font-medium" style="color: var(--text-primary);">{sub.name}</span>
							<span class="text-sm font-medium" style="color: var(--text-secondary);">
								{formatCurrency(sub.amount, settings.currency)}
							</span>
							<span
								class="min-w-[60px] rounded-full px-2 py-1 text-center text-xs font-medium"
								class:bg-red-100={days === 0}
								class:text-red-700={days === 0}
								class:bg-amber-100={days > 0 && days <= 3}
								class:text-amber-700={days > 0 && days <= 3}
								style={days > 3 ? 'background-color: var(--bg-tertiary); color: var(--text-secondary);' : ''}
							>
								{days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
							</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Category Breakdown -->
		{#if categorySegments.length > 0}
			<section class="mb-6 rounded-xl p-4" style="background-color: var(--card-bg); box-shadow: var(--card-shadow);">
				<h2 class="mb-4 text-base font-semibold" style="color: var(--text-primary);">Spending by Category</h2>
				<DonutChart
					segments={categorySegments}
					currency={settings.currency}
					onSegmentClick={handleSegmentClick}
				/>
			</section>
		{/if}

		<!-- Quick Stats -->
		<section class="mb-6 grid grid-cols-3 gap-3">
			<div class="rounded-xl p-3 text-center" style="background-color: var(--card-bg); box-shadow: var(--card-shadow);">
				<div class="text-xl font-bold text-brand-500">{activeSubs.length}</div>
				<div class="text-xs" style="color: var(--text-secondary);">Active</div>
			</div>
			<div class="rounded-xl p-3 text-center" style="background-color: var(--card-bg); box-shadow: var(--card-shadow);">
				<div class="text-xl font-bold text-brand-500">{formatCurrency(avgCost, settings.currency)}</div>
				<div class="text-xs" style="color: var(--text-secondary);">Avg/mo</div>
			</div>
			<div class="rounded-xl p-3 text-center" style="background-color: var(--card-bg); box-shadow: var(--card-shadow);">
				{#if mostExpensive}
					<div class="truncate text-sm font-bold text-brand-500">{mostExpensive.name}</div>
					<div class="text-xs" style="color: var(--text-secondary);">Top spend</div>
				{:else}
					<div class="text-sm" style="color: var(--text-tertiary);">—</div>
				{/if}
			</div>
		</section>
	{/if}
</div>
