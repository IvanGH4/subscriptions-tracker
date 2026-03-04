<script lang="ts">
	import { goto } from '$app/navigation';
	import { subscriptionStore } from '$lib/stores/subscriptions.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import SubscriptionForm from '$lib/components/SubscriptionForm.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	function handleSubmit(data: Parameters<typeof subscriptionStore.add>[0]) {
		subscriptionStore.add({
			...data,
			currency: data.currency || settingsStore.current.currency
		});
		goto('/subscriptions');
	}
</script>

<svelte:head>
	<title>Add Subscription — SubTracker</title>
</svelte:head>

<div class="flex items-center gap-3 border-b px-4 py-3" style="border-color: var(--border-color);">
	<a href="/subscriptions" class="flex items-center justify-center p-1" aria-label="Back">
		<ArrowLeft size={22} />
	</a>
	<h1 class="text-lg font-semibold" style="color: var(--text-primary);">Add Subscription</h1>
</div>

<SubscriptionForm submitLabel="Add Subscription" onsubmit={handleSubmit} />
