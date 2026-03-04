<script lang="ts">
	import { CATEGORY_META } from '$lib/constants';
	import { formatCurrency } from '$lib/utils/currency';
	import { toMonthly } from '$lib/utils/billing';
	import { relativeDate, daysUntil } from '$lib/utils/dates';
	import { Pencil, Trash2 } from 'lucide-svelte';
	import type { Subscription } from '$lib/types';

	let {
		subscription,
		currency = 'USD',
		ondelete
	}: {
		subscription: Subscription;
		currency?: string;
		ondelete?: () => void;
	} = $props();

	let meta = $derived(CATEGORY_META[subscription.category]);
	let monthlyAmount = $derived(toMonthly(subscription.amount, subscription.cycle));
	let days = $derived(daysUntil(subscription.nextBillingDate));
	let relative = $derived(relativeDate(subscription.nextBillingDate));

	// Swipe state
	let translateX = $state(0);
	let startX = $state(0);
	let swiping = $state(false);
	let showConfirm = $state(false);

	function handleTouchStart(e: TouchEvent) {
		startX = e.touches[0].clientX;
		swiping = true;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!swiping) return;
		const diff = e.touches[0].clientX - startX;
		if (diff < 0) {
			translateX = Math.max(diff, -140);
		} else {
			translateX = 0;
		}
	}

	function handleTouchEnd() {
		swiping = false;
		if (translateX < -70) {
			translateX = -140;
		} else {
			translateX = 0;
		}
	}

	function confirmDelete() {
		showConfirm = true;
	}

	function cancelDelete() {
		showConfirm = false;
		translateX = 0;
	}

	function doDelete() {
		ondelete?.();
		showConfirm = false;
	}
</script>

<article class="relative overflow-hidden rounded-xl" style="box-shadow: var(--card-shadow);">
	<!-- Swipe actions behind -->
	<div class="absolute inset-y-0 right-0 flex">
		<a
			href="/subscriptions/{subscription.id}/edit"
			class="flex w-[70px] items-center justify-center bg-brand-500 text-white"
			aria-label="Edit {subscription.name}"
		>
			<Pencil size={20} />
		</a>
		<button
			class="flex w-[70px] items-center justify-center bg-red-500 text-white"
			onclick={confirmDelete}
			aria-label="Delete {subscription.name}"
		>
			<Trash2 size={20} />
		</button>
	</div>

	<!-- Card content -->
	<div
		class="relative flex items-center gap-3 p-4 transition-transform"
		style="background-color: var(--card-bg); transform: translateX({translateX}px); border-left: 4px solid {meta.color};"
		class:opacity-50={subscription.isPaused}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		role="article"
	>
		<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl" style="background-color: var(--bg-tertiary);">
			{subscription.icon || meta.emoji}
		</div>

		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<h3 class="truncate font-medium" style="color: var(--text-primary);">
					{subscription.name}
				</h3>
				{#if subscription.isPaused}
					<span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Paused</span>
				{/if}
			</div>
			<div class="flex items-center gap-2 text-sm" style="color: var(--text-secondary);">
				<span class="rounded-full px-2 py-0.5 text-xs" style="background-color: var(--bg-tertiary);">
					{subscription.cycle}
				</span>
				<span
					class:text-red-500={days === 0}
					class:text-amber-500={days > 0 && days <= 3}
				>
					{relative}
				</span>
			</div>
		</div>

		<div class="text-right">
			<div class="font-semibold" style="color: var(--text-primary);">
				{formatCurrency(monthlyAmount, currency)}
			</div>
			<div class="text-xs" style="color: var(--text-tertiary);">/mo</div>
		</div>
	</div>

	<!-- Delete confirmation -->
	{#if showConfirm}
		<div class="absolute inset-0 flex items-center justify-center gap-3 bg-red-500/95 px-4">
			<span class="text-sm font-medium text-white">Delete {subscription.name}?</span>
			<button
				class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-500"
				onclick={doDelete}
			>
				Delete
			</button>
			<button
				class="rounded-lg border border-white px-4 py-2 text-sm font-medium text-white"
				onclick={cancelDelete}
			>
				Cancel
			</button>
		</div>
	{/if}
</article>
