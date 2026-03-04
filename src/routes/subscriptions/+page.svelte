<script lang="ts">
	import { subscriptionStore } from '$lib/stores/subscriptions.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { toMonthly } from '$lib/utils/billing';
	import { daysUntil } from '$lib/utils/dates';
	import { CATEGORY_META } from '$lib/constants';
	import { page } from '$app/state';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CategoryChip from '$lib/components/CategoryChip.svelte';
	import SubscriptionCard from '$lib/components/SubscriptionCard.svelte';
	import FAB from '$lib/components/FAB.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { ListX } from 'lucide-svelte';
	import type { Category, Subscription } from '$lib/types';

	let search = $state('');
	let selectedCategories = $state<Set<Category>>(new Set());
	let showPaused = $state(true);

	// Initialize category filter from URL param
	$effect(() => {
		const cat = page.url.searchParams.get('category');
		if (cat && cat in CATEGORY_META) {
			selectedCategories = new Set([cat as Category]);
		}
	});

	let settings = $derived(settingsStore.current);
	let allCategories = Object.keys(CATEGORY_META) as Category[];

	function toggleCategory(cat: Category) {
		const next = new Set(selectedCategories);
		if (next.has(cat)) {
			next.delete(cat);
		} else {
			next.add(cat);
		}
		selectedCategories = next;
	}

	function sortSubs(items: Subscription[]): Subscription[] {
		const sorted = [...items];
		const { sortBy, sortDirection } = settings;
		sorted.sort((a, b) => {
			let cmp = 0;
			switch (sortBy) {
				case 'name':
					cmp = a.name.localeCompare(b.name);
					break;
				case 'amount':
					cmp = toMonthly(a.amount, a.cycle) - toMonthly(b.amount, b.cycle);
					break;
				case 'nextBilling':
					cmp = daysUntil(a.nextBillingDate) - daysUntil(b.nextBillingDate);
					break;
				case 'category':
					cmp = a.category.localeCompare(b.category);
					break;
			}
			return sortDirection === 'desc' ? -cmp : cmp;
		});
		return sorted;
	}

	let filtered = $derived.by(() => {
		let items = subscriptionStore.items;

		if (!showPaused) {
			items = items.filter((s) => !s.isPaused);
		}

		if (search) {
			const q = search.toLowerCase();
			items = items.filter((s) => s.name.toLowerCase().includes(q));
		}

		if (selectedCategories.size > 0) {
			items = items.filter((s) => selectedCategories.has(s.category));
		}

		return sortSubs(items);
	});

	function clearFilters() {
		search = '';
		selectedCategories = new Set();
		showPaused = true;
	}

	function handleDelete(id: string) {
		subscriptionStore.remove(id);
	}
</script>

<svelte:head>
	<title>Subscriptions — SubTracker</title>
</svelte:head>

<div class="px-4 pt-6">
	<h1 class="mb-4 text-2xl font-bold" style="color: var(--text-primary);">Subscriptions</h1>

	<div class="mb-4">
		<SearchBar bind:value={search} placeholder="Search subscriptions..." />
	</div>

	<!-- Category chips -->
	<div class="mb-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2" style="scrollbar-width: none;">
		{#each allCategories as cat}
			<CategoryChip
				category={cat}
				selected={selectedCategories.has(cat)}
				onclick={() => toggleCategory(cat)}
			/>
		{/each}
	</div>

	<!-- Show/hide paused toggle -->
	<div class="mb-4 flex items-center gap-2">
		<label class="flex cursor-pointer items-center gap-2 text-sm" style="color: var(--text-secondary);">
			<input
				type="checkbox"
				bind:checked={showPaused}
				class="h-4 w-4 rounded accent-brand-500"
			/>
			Show paused
		</label>
		{#if selectedCategories.size > 0 || search}
			<button
				class="ml-auto text-sm text-brand-500 hover:text-brand-600"
				onclick={clearFilters}
			>
				Clear filters
			</button>
		{/if}
	</div>

	<!-- Subscription list -->
	{#if filtered.length === 0}
		{#if subscriptionStore.items.length === 0}
			<EmptyState
				title="No subscriptions yet"
				message="Add your first subscription to start tracking."
				ctaLabel="Add Subscription"
				ctaHref="/subscriptions/new"
			/>
		{:else}
			<EmptyState
				icon={ListX}
				title="No results"
				message="No subscriptions match your current filters."
				ctaLabel="Clear filters"
				ctaHref="/subscriptions"
			/>
		{/if}
	{:else}
		<div class="flex flex-col gap-3">
			{#each filtered as sub, i}
				<div
					style="animation: fadeSlideIn 0.2s ease-out {i * 0.05}s both;"
				>
					<SubscriptionCard
						subscription={sub}
						currency={settings.currency}
						ondelete={() => handleDelete(sub.id)}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>

<FAB />

<style>
	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
