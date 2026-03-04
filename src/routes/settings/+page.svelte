<script lang="ts">
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { subscriptionStore } from '$lib/stores/subscriptions.svelte';
	import { CURRENCIES } from '$lib/constants';
	import { exportData, validateImportData, getImportDiff, clearAllData } from '$lib/services/storage';
	import { requestNotificationPermission } from '$lib/services/notifications';
	import type { ThemeMode, SortField, SortDirection } from '$lib/types';

	let settings = $derived(settingsStore.current);
	let budgetInput = $state<string>(settings.monthlyBudget?.toString() || '');
	let importStatus = $state('');
	let showClearConfirm = $state(0); // 0=none, 1=first, 2=confirmed

	const themes: { value: ThemeMode; label: string }[] = [
		{ value: 'system', label: 'System' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];

	const sortFields: { value: SortField; label: string }[] = [
		{ value: 'nextBilling', label: 'Next Billing' },
		{ value: 'name', label: 'Name' },
		{ value: 'amount', label: 'Amount' },
		{ value: 'category', label: 'Category' }
	];

	function handleBudgetChange() {
		const val = budgetInput.trim();
		if (!val) {
			settingsStore.setBudget(null);
		} else {
			const num = parseFloat(val);
			if (!isNaN(num) && num > 0) {
				settingsStore.setBudget(num);
			}
		}
	}

	function handleExport() {
		const json = exportData();
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `subtracker-export-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			try {
				const text = await file.text();
				const data = validateImportData(text);
				if (!data) {
					importStatus = 'Invalid file format.';
					return;
				}
				const diff = getImportDiff(data);
				const confirm = window.confirm(
					`Import will add ${diff.newCount} new, update ${diff.updatedCount}, and keep ${diff.unchangedCount} unchanged subscriptions. Continue?`
				);
				if (!confirm) return;
				if (diff.subscriptions.length > 0) {
					subscriptionStore.replaceAll(diff.subscriptions);
				}
				if (data.settings) {
					settingsStore.replaceAll(diff.settings);
					budgetInput = diff.settings.monthlyBudget?.toString() || '';
				}
				importStatus = 'Import successful!';
			} catch {
				importStatus = 'Failed to read file.';
			}
		};
		input.click();
	}

	function handleClearAll() {
		if (showClearConfirm === 0) {
			showClearConfirm = 1;
		} else if (showClearConfirm === 1) {
			showClearConfirm = 2;
		} else {
			clearAllData();
			subscriptionStore.replaceAll([]);
			settingsStore.load();
			budgetInput = '';
			showClearConfirm = 0;
		}
	}

	async function handleNotifications() {
		const granted = await requestNotificationPermission();
		if (granted) {
			alert('Notifications enabled! You\'ll be notified before renewals.');
		} else {
			alert('Notification permission was denied.');
		}
	}
</script>

<svelte:head>
	<title>Settings — SubTracker</title>
</svelte:head>

<div class="px-4 pt-6">
	<h1 class="mb-6 text-2xl font-bold" style="color: var(--text-primary);">Settings</h1>

	<div class="flex flex-col gap-6">
		<!-- Currency -->
		<section>
			<label for="settings-currency" class="mb-1 block text-sm font-medium" style="color: var(--text-secondary);">
				Default Currency
			</label>
			<select
				id="settings-currency"
				value={settings.currency}
				onchange={(e) => settingsStore.setCurrency(e.currentTarget.value)}
				class="w-full rounded-xl border px-4 py-3 text-sm outline-none"
				style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
			>
				{#each CURRENCIES as c}
					<option value={c.code}>{c.symbol} {c.code} — {c.name}</option>
				{/each}
			</select>
		</section>

		<!-- Monthly Budget -->
		<section>
			<label for="settings-budget" class="mb-1 block text-sm font-medium" style="color: var(--text-secondary);">
				Monthly Budget (optional)
			</label>
			<input
				id="settings-budget"
				type="number"
				bind:value={budgetInput}
				onchange={handleBudgetChange}
				placeholder="e.g. 100"
				min="0"
				step="0.01"
				class="w-full rounded-xl border px-4 py-3 text-sm outline-none"
				style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
			/>
		</section>

		<!-- Theme -->
		<section>
			<span class="mb-2 block text-sm font-medium" style="color: var(--text-secondary);">Theme</span>
			<div class="flex gap-1 rounded-xl p-1" style="background-color: var(--bg-tertiary);">
				{#each themes as t}
					<button
						class="flex-1 rounded-lg py-2.5 text-center text-sm font-medium transition-all"
						style={settings.theme === t.value
							? 'background-color: var(--card-bg); color: var(--text-primary); box-shadow: var(--card-shadow);'
							: 'color: var(--text-tertiary);'}
						onclick={() => settingsStore.setTheme(t.value)}
					>
						{t.label}
					</button>
				{/each}
			</div>
		</section>

		<!-- Sort Preference -->
		<section>
			<span class="mb-2 block text-sm font-medium" style="color: var(--text-secondary);">Default Sort</span>
			<div class="flex gap-3">
				<select
					value={settings.sortBy}
					onchange={(e) => settingsStore.setSortBy(e.currentTarget.value as SortField)}
					class="flex-1 rounded-xl border px-3 py-3 text-sm outline-none"
					style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
				>
					{#each sortFields as f}
						<option value={f.value}>{f.label}</option>
					{/each}
				</select>
				<button
					class="rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
					style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
					onclick={() => settingsStore.setSortDirection(settings.sortDirection === 'asc' ? 'desc' : 'asc')}
				>
					{settings.sortDirection === 'asc' ? 'A→Z' : 'Z→A'}
				</button>
			</div>
		</section>

		<!-- Notifications -->
		<section>
			<button
				class="w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors"
				style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
				onclick={handleNotifications}
			>
				Enable Renewal Notifications
			</button>
		</section>

		<hr style="border-color: var(--border-color);" />

		<!-- Export / Import -->
		<section class="flex flex-col gap-3">
			<button
				class="w-full rounded-xl bg-brand-500 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
				onclick={handleExport}
			>
				Export Data (JSON)
			</button>
			<button
				class="w-full rounded-xl border py-3 text-sm font-medium transition-colors"
				style="border-color: var(--border-color); color: var(--text-primary);"
				onclick={handleImport}
			>
				Import Data
			</button>
			{#if importStatus}
				<p class="text-center text-sm" class:text-green-500={importStatus.includes('successful')} class:text-red-500={!importStatus.includes('successful')}>
					{importStatus}
				</p>
			{/if}
		</section>

		<hr style="border-color: var(--border-color);" />

		<!-- Clear All -->
		<section>
			{#if showClearConfirm === 0}
				<button
					class="w-full rounded-xl border-2 border-red-200 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
					onclick={handleClearAll}
				>
					Clear All Data
				</button>
			{:else if showClearConfirm === 1}
				<button
					class="w-full rounded-xl bg-red-100 py-3 text-sm font-medium text-red-600 transition-colors"
					onclick={handleClearAll}
				>
					Are you sure? Click again to confirm.
				</button>
			{:else}
				<button
					class="w-full rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition-colors"
					onclick={handleClearAll}
				>
					FINAL CONFIRMATION — Delete everything
				</button>
			{/if}
		</section>

		<!-- About -->
		<section class="pb-8 text-center text-sm" style="color: var(--text-tertiary);">
			<p>SubTracker v1.0.0</p>
			<p class="mt-1">All data stays on your device.</p>
		</section>
	</div>
</div>
