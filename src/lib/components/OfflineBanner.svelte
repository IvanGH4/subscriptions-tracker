<script lang="ts">
	import { WifiOff } from 'lucide-svelte';

	let online = $state(true);

	function handleOnline() {
		online = true;
	}
	function handleOffline() {
		online = false;
	}
</script>

<svelte:window ononline={handleOnline} onoffline={handleOffline} />

{#if !online}
	<div
		class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500 py-2 text-sm font-medium text-white"
		role="alert"
		aria-live="polite"
	>
		<WifiOff size={16} />
		You're offline — changes are saved locally
	</div>
{/if}
