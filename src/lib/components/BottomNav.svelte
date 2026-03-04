<script lang="ts">
	import { page } from '$app/state';
	import { LayoutDashboard, List, Settings } from 'lucide-svelte';

	const tabs = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/subscriptions', label: 'Subscriptions', icon: List },
		{ href: '/settings', label: 'Settings', icon: Settings }
	] as const;

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		return path.startsWith(href);
	}
</script>

<nav
	aria-label="Main navigation"
	class="fixed bottom-0 left-0 right-0 z-50 border-t"
	style="background-color: var(--nav-bg); border-color: var(--nav-border);"
>
	<div class="mx-auto flex max-w-md items-center justify-around">
		{#each tabs as tab}
			<a
				href={tab.href}
				class="flex min-h-[56px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
				class:text-brand-500={isActive(tab.href)}
				style={isActive(tab.href) ? '' : 'color: var(--text-tertiary)'}
				aria-current={isActive(tab.href) ? 'page' : undefined}
			>
				<tab.icon size={22} />
				<span>{tab.label}</span>
			</a>
		{/each}
	</div>
</nav>
