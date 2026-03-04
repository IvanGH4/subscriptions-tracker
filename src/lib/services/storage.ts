import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';
import type { Subscription, Settings } from '../types';

export function loadSubscriptions(): Subscription[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function saveSubscriptions(subs: Subscription[]): void {
	localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
}

export function loadSettings(): Settings {
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
		if (!raw) return { ...DEFAULT_SETTINGS };
		return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}

export function saveSettings(settings: Settings): void {
	localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function exportData(): string {
	const data = {
		version: 1,
		exportedAt: new Date().toISOString(),
		subscriptions: loadSubscriptions(),
		settings: loadSettings()
	};
	return JSON.stringify(data, null, 2);
}

export interface ImportData {
	version?: number;
	subscriptions?: Subscription[];
	settings?: Settings;
}

export interface ImportDiff {
	newCount: number;
	updatedCount: number;
	unchangedCount: number;
	subscriptions: Subscription[];
	settings: Settings;
}

export function validateImportData(raw: string): ImportData | null {
	try {
		const data = JSON.parse(raw);
		if (!data || typeof data !== 'object') return null;
		if (data.subscriptions && !Array.isArray(data.subscriptions)) return null;
		return data as ImportData;
	} catch {
		return null;
	}
}

export function getImportDiff(importData: ImportData): ImportDiff {
	const current = loadSubscriptions();
	const currentIds = new Set(current.map((s) => s.id));
	const incoming = importData.subscriptions || [];

	let newCount = 0;
	let updatedCount = 0;
	let unchangedCount = 0;

	for (const sub of incoming) {
		if (!currentIds.has(sub.id)) {
			newCount++;
		} else {
			const existing = current.find((s) => s.id === sub.id);
			if (existing && existing.updatedAt !== sub.updatedAt) {
				updatedCount++;
			} else {
				unchangedCount++;
			}
		}
	}

	return {
		newCount,
		updatedCount,
		unchangedCount,
		subscriptions: incoming,
		settings: importData.settings || loadSettings()
	};
}

export function clearAllData(): void {
	localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
	localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
