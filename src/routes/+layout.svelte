<script lang="ts">
	import '../app.css';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import OfflineBanner from '$lib/components/OfflineBanner.svelte';
	import { subscriptionStore } from '$lib/stores/subscriptions.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		settingsStore.load();
		subscriptionStore.load();
	});
</script>

<OfflineBanner />

<div class="mx-auto min-h-screen max-w-md pb-20" style="background-color: var(--bg-primary);">
	<main>
		{@render children()}
	</main>
</div>

<BottomNav />
