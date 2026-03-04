<script lang="ts">
	import { onMount, untrack } from 'svelte';

	let { value, duration = 300, formatter }: { value: number; duration?: number; formatter?: (n: number) => string } = $props();

	let display = $state(0);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	$effect(() => {
		if (!mounted) return;
		const target = value;
		const start = untrack(() => display);
		const startTime = performance.now();
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReduced || start === target) {
			display = target;
			return;
		}

		function tick(now: number) {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
			display = start + (target - start) * eased;

			if (progress < 1) {
				requestAnimationFrame(tick);
			} else {
				display = target;
			}
		}

		requestAnimationFrame(tick);
	});

	let formatted = $derived(formatter ? formatter(display) : display.toFixed(2));
</script>

<span>{formatted}</span>
