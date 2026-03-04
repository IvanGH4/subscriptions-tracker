import { loadSettings, saveSettings } from '../services/storage';
import type { Settings, ThemeMode, SortField, SortDirection } from '../types';

function createSettingsStore() {
	let settings = $state<Settings>(loadSettings());

	function persist() {
		saveSettings(settings);
	}

	function applyTheme(theme: ThemeMode) {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', theme);
		}
	}

	function load() {
		settings = loadSettings();
		applyTheme(settings.theme);
	}

	function setCurrency(currency: string) {
		settings.currency = currency;
		persist();
	}

	function setBudget(budget: number | null) {
		settings.monthlyBudget = budget;
		persist();
	}

	function setTheme(theme: ThemeMode) {
		settings.theme = theme;
		applyTheme(theme);
		persist();
	}

	function setSortBy(sortBy: SortField) {
		settings.sortBy = sortBy;
		persist();
	}

	function setSortDirection(dir: SortDirection) {
		settings.sortDirection = dir;
		persist();
	}

	function replaceAll(newSettings: Settings) {
		settings = { ...newSettings };
		applyTheme(settings.theme);
		persist();
	}

	return {
		get current() {
			return settings;
		},
		load,
		setCurrency,
		setBudget,
		setTheme,
		setSortBy,
		setSortDirection,
		replaceAll
	};
}

export const settingsStore = createSettingsStore();
