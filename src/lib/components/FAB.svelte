<script lang="ts">
	import { Plus } from 'lucide-svelte';

	let { href = '/subscriptions/new' }: { href?: string } = $props();
</script>

<a
	{href}
	class="fixed right-4 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-600 active:scale-95"
	aria-label="Add subscription"
>
	<Plus size={24} />
</a>
