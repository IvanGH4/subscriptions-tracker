<script lang="ts">
	import { CATEGORY_META, COLOR_PALETTE, EMOJI_PICKER, CURRENCIES } from '$lib/constants';
	import { searchServices, type PopularService } from '$lib/data/popular-services';
	import { toISODate } from '$lib/utils/dates';
	import type { Category, BillingCycle, Subscription } from '$lib/types';

	let {
		initial,
		submitLabel = 'Save',
		onsubmit
	}: {
		initial?: Partial<Subscription>;
		submitLabel?: string;
		onsubmit: (data: {
			name: string;
			amount: number;
			currency: string;
			cycle: BillingCycle;
			startDate: string;
			category: Category;
			color: string;
			icon: string | null;
			notes: string;
			isPaused: boolean;
		}) => void;
	} = $props();

	let name = $state(initial?.name || '');
	let amount = $state(initial?.amount || 0);
	let currency = $state(initial?.currency || 'USD');
	let cycle = $state<BillingCycle>(initial?.cycle || 'monthly');
	let startDate = $state(initial?.startDate || toISODate());
	let category = $state<Category>(initial?.category || 'other');
	let color = $state(initial?.color || COLOR_PALETTE[6]);
	let icon = $state<string | null>(initial?.icon || null);
	let notes = $state(initial?.notes || '');
	let isPaused = $state(initial?.isPaused || false);

	let suggestions = $state<PopularService[]>([]);
	let showSuggestions = $state(false);
	let showNotes = $state(!!initial?.notes);
	let showEmoji = $state(false);

	const cycles: { value: BillingCycle; label: string }[] = [
		{ value: 'weekly', label: 'Week' },
		{ value: 'monthly', label: 'Month' },
		{ value: 'quarterly', label: '3 Mo' },
		{ value: 'semi-annual', label: '6 Mo' },
		{ value: 'yearly', label: 'Year' }
	];

	const categories = Object.keys(CATEGORY_META) as Category[];

	function handleNameInput() {
		suggestions = searchServices(name);
		showSuggestions = suggestions.length > 0;
	}

	function selectService(service: PopularService) {
		name = service.name;
		category = service.category;
		icon = service.icon;
		color = service.color;
		cycle = service.defaultCycle;
		showSuggestions = false;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim() || amount <= 0) return;
		onsubmit({ name: name.trim(), amount, currency, cycle, startDate, category, color, icon, notes, isPaused });
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-5 p-4">
	<!-- Name with autocomplete -->
	<div class="relative">
		<label for="sub-name" class="mb-1 block text-sm font-medium" style="color: var(--text-secondary);">
			Name
		</label>
		<input
			id="sub-name"
			type="text"
			bind:value={name}
			oninput={handleNameInput}
			onfocus={() => handleNameInput()}
			onblur={() => setTimeout(() => (showSuggestions = false), 200)}
			placeholder="e.g. Netflix"
			required
			class="w-full rounded-xl border px-4 py-3 text-sm outline-none"
			style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
			autocomplete="off"
		/>
		{#if showSuggestions && suggestions.length > 0}
			<div
				class="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border shadow-lg"
				style="background-color: var(--card-bg); border-color: var(--border-color);"
			>
				{#each suggestions as service}
					<button
						type="button"
						class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:opacity-80"
						style="color: var(--text-primary);"
						onmousedown={() => selectService(service)}
					>
						<span class="text-lg">{service.icon}</span>
						<span>{service.name}</span>
						<span class="ml-auto text-xs" style="color: var(--text-tertiary);">{CATEGORY_META[service.category].label}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Amount + Currency -->
	<div class="flex gap-3">
		<div class="flex-1">
			<label for="sub-amount" class="mb-1 block text-sm font-medium" style="color: var(--text-secondary);">
				Amount
			</label>
			<input
				id="sub-amount"
				type="number"
				bind:value={amount}
				min="0.01"
				step="0.01"
				required
				class="w-full rounded-xl border px-4 py-3 text-sm outline-none"
				style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
			/>
		</div>
		<div class="w-28">
			<label for="sub-currency" class="mb-1 block text-sm font-medium" style="color: var(--text-secondary);">
				Currency
			</label>
			<select
				id="sub-currency"
				bind:value={currency}
				class="w-full rounded-xl border px-3 py-3 text-sm outline-none"
				style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
			>
				{#each CURRENCIES as c}
					<option value={c.code}>{c.code}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Billing Cycle -->
	<div>
		<span class="mb-2 block text-sm font-medium" style="color: var(--text-secondary);">Billing Cycle</span>
		<div class="flex gap-1 rounded-xl p-1" style="background-color: var(--bg-tertiary);">
			{#each cycles as c}
				<button
					type="button"
					class="flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all"
					style={cycle === c.value
						? 'background-color: var(--card-bg); color: var(--text-primary); box-shadow: var(--card-shadow);'
						: 'color: var(--text-tertiary);'}
					onclick={() => (cycle = c.value)}
				>
					{c.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Start Date -->
	<div>
		<label for="sub-date" class="mb-1 block text-sm font-medium" style="color: var(--text-secondary);">
			Start Date
		</label>
		<input
			id="sub-date"
			type="date"
			bind:value={startDate}
			class="w-full rounded-xl border px-4 py-3 text-sm outline-none"
			style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
		/>
	</div>

	<!-- Category -->
	<div>
		<span class="mb-2 block text-sm font-medium" style="color: var(--text-secondary);">Category</span>
		<div class="flex flex-wrap gap-2">
			{#each categories as cat}
				<button
					type="button"
					class="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all"
					style={category === cat
						? `background-color: ${CATEGORY_META[cat].color}; color: white; border-color: ${CATEGORY_META[cat].color};`
						: `background-color: var(--bg-secondary); color: var(--text-secondary); border-color: var(--border-color);`}
					onclick={() => (category = cat)}
				>
					{CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Color -->
	<div>
		<span class="mb-2 block text-sm font-medium" style="color: var(--text-secondary);">Color</span>
		<div class="flex flex-wrap gap-2">
			{#each COLOR_PALETTE as c}
				<button
					type="button"
					class="h-9 w-9 rounded-full border-2 transition-transform hover:scale-110"
					style="background-color: {c}; border-color: {color === c ? 'var(--text-primary)' : 'transparent'};"
					onclick={() => (color = c)}
					aria-label="Select color {c}"
				></button>
			{/each}
		</div>
	</div>

	<!-- Emoji Icon -->
	<div>
		<div class="mb-2 flex items-center gap-2">
			<span class="text-sm font-medium" style="color: var(--text-secondary);">Icon</span>
			<button
				type="button"
				class="rounded-lg border px-3 py-1 text-lg"
				style="background-color: var(--bg-secondary); border-color: var(--border-color);"
				onclick={() => (showEmoji = !showEmoji)}
			>
				{icon || '📦'}
			</button>
		</div>
		{#if showEmoji}
			<div class="grid grid-cols-8 gap-1 rounded-xl border p-2" style="background-color: var(--bg-secondary); border-color: var(--border-color);">
				{#each EMOJI_PICKER as emoji}
					<button
						type="button"
						class="flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:opacity-80"
						style={icon === emoji ? 'background-color: var(--bg-tertiary);' : ''}
						onclick={() => { icon = emoji; showEmoji = false; }}
					>
						{emoji}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Notes -->
	<div>
		{#if !showNotes}
			<button
				type="button"
				class="text-sm text-brand-500 hover:text-brand-600"
				onclick={() => (showNotes = true)}
			>
				+ Add notes
			</button>
		{:else}
			<label for="sub-notes" class="mb-1 block text-sm font-medium" style="color: var(--text-secondary);">
				Notes
			</label>
			<textarea
				id="sub-notes"
				bind:value={notes}
				rows="3"
				class="w-full rounded-xl border px-4 py-3 text-sm outline-none"
				style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary);"
				placeholder="Optional notes..."
			></textarea>
		{/if}
	</div>

	<!-- Submit -->
	<div class="sticky bottom-0 pt-2 pb-4" style="background-color: var(--bg-primary);">
		<button
			type="submit"
			class="w-full rounded-xl bg-brand-500 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-600 active:bg-brand-700"
		>
			{submitLabel}
		</button>
	</div>
</form>
