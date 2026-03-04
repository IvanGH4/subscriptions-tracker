import { loadSubscriptions, saveSubscriptions } from '../services/storage';
import { calculateNextBillingDate } from '../utils/billing';
import type { Subscription } from '../types';

function createSubscriptionStore() {
	let items = $state<Subscription[]>([]);
	let loaded = $state(false);

	function load() {
		items = loadSubscriptions();
		loaded = true;
	}

	function persist() {
		saveSubscriptions(items);
	}

	function add(sub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt' | 'nextBillingDate'>) {
		const now = new Date().toISOString();
		const newSub: Subscription = {
			...sub,
			id: crypto.randomUUID(),
			nextBillingDate: calculateNextBillingDate(sub.startDate, sub.cycle),
			createdAt: now,
			updatedAt: now
		};
		items = [...items, newSub];
		persist();
		return newSub;
	}

	function update(id: string, updates: Partial<Omit<Subscription, 'id' | 'createdAt'>>) {
		items = items.map((s) => {
			if (s.id !== id) return s;
			const updated = { ...s, ...updates, updatedAt: new Date().toISOString() };
			if (updates.startDate || updates.cycle) {
				updated.nextBillingDate = calculateNextBillingDate(
					updated.startDate,
					updated.cycle
				);
			}
			return updated;
		});
		persist();
	}

	function remove(id: string) {
		items = items.filter((s) => s.id !== id);
		persist();
	}

	function getById(id: string): Subscription | undefined {
		return items.find((s) => s.id === id);
	}

	function togglePause(id: string) {
		const sub = items.find((s) => s.id === id);
		if (sub) {
			update(id, { isPaused: !sub.isPaused });
		}
	}

	function replaceAll(subs: Subscription[]) {
		items = subs;
		persist();
	}

	return {
		get items() {
			return items;
		},
		get loaded() {
			return loaded;
		},
		load,
		add,
		update,
		remove,
		getById,
		togglePause,
		replaceAll
	};
}

export const subscriptionStore = createSubscriptionStore();
