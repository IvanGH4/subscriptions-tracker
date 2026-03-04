<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { subscriptionStore } from '$lib/stores/subscriptions.svelte';
	import SubscriptionForm from '$lib/components/SubscriptionForm.svelte';
	import { ArrowLeft, Trash2 } from 'lucide-svelte';

	let sub = $derived(subscriptionStore.getById(page.params.id));
	let showDeleteConfirm = $state(false);

	function handleSubmit(data: Parameters<typeof subscriptionStore.update>[1]) {
		subscriptionStore.update(page.params.id, data);
		goto('/subscriptions');
	}

	function handleTogglePause() {
		subscriptionStore.togglePause(page.params.id);
	}

	function handleDelete() {
		subscriptionStore.remove(page.params.id);
		goto('/subscriptions');
	}
</script>

<svelte:head>
	<title>Edit Subscription — SubTracker</title>
</svelte:head>

{#if sub}
	<div class="flex items-center gap-3 border-b px-4 py-3" style="border-color: var(--border-color);">
		<a href="/subscriptions" class="flex items-center justify-center p-1" aria-label="Back">
			<ArrowLeft size={22} />
		</a>
		<h1 class="flex-1 text-lg font-semibold" style="color: var(--text-primary);">Edit {sub.name}</h1>
	</div>

	<!-- Pause/Resume toggle -->
	<div class="flex items-center justify-between border-b px-4 py-3" style="border-color: var(--border-color);">
		<span class="text-sm font-medium" style="color: var(--text-secondary);">
			{sub.isPaused ? 'Subscription is paused' : 'Subscription is active'}
		</span>
		<button
			class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
			class:bg-amber-100={!sub.isPaused}
			class:text-amber-700={!sub.isPaused}
			class:bg-green-100={sub.isPaused}
			class:text-green-700={sub.isPaused}
			onclick={handleTogglePause}
		>
			{sub.isPaused ? 'Resume' : 'Pause'}
		</button>
	</div>

	<SubscriptionForm initial={sub} submitLabel="Save Changes" onsubmit={handleSubmit} />

	<!-- Delete button -->
	<div class="px-4 pb-8">
		{#if !showDeleteConfirm}
			<button
				class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
				onclick={() => (showDeleteConfirm = true)}
			>
				<Trash2 size={16} />
				Delete Subscription
			</button>
		{:else}
			<div class="flex flex-col gap-2 rounded-xl border-2 border-red-500 p-4">
				<p class="text-center text-sm font-medium text-red-500">Delete "{sub.name}"? This can't be undone.</p>
				<div class="flex gap-2">
					<button
						class="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white"
						onclick={handleDelete}
					>
						Delete
					</button>
					<button
						class="flex-1 rounded-lg border py-2 text-sm font-medium"
						style="border-color: var(--border-color); color: var(--text-secondary);"
						onclick={() => (showDeleteConfirm = false)}
					>
						Cancel
					</button>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="p-6 text-center" style="color: var(--text-secondary);">
		<p>Subscription not found.</p>
		<a href="/subscriptions" class="mt-2 inline-block text-brand-500">Back to list</a>
	</div>
{/if}
