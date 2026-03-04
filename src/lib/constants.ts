import type { Category, Settings } from './types';

export const STORAGE_KEYS = {
	SUBSCRIPTIONS: 'sub-tracker:subscriptions',
	SETTINGS: 'sub-tracker:settings'
} as const;

export const CATEGORY_META: Record<Category, { emoji: string; color: string; label: string }> = {
	streaming: { emoji: '🎬', color: '#ef4444', label: 'Streaming' },
	music: { emoji: '🎵', color: '#ec4899', label: 'Music' },
	gaming: { emoji: '🎮', color: '#8b5cf6', label: 'Gaming' },
	software: { emoji: '💻', color: '#3b82f6', label: 'Software' },
	cloud: { emoji: '☁️', color: '#06b6d4', label: 'Cloud' },
	news: { emoji: '📰', color: '#f59e0b', label: 'News' },
	fitness: { emoji: '💪', color: '#10b981', label: 'Fitness' },
	food: { emoji: '🍔', color: '#f97316', label: 'Food' },
	education: { emoji: '📚', color: '#6366f1', label: 'Education' },
	finance: { emoji: '💰', color: '#14b8a6', label: 'Finance' },
	shopping: { emoji: '🛒', color: '#e879f9', label: 'Shopping' },
	utilities: { emoji: '🔧', color: '#64748b', label: 'Utilities' },
	other: { emoji: '📦', color: '#94a3b8', label: 'Other' }
};

export const DEFAULT_SETTINGS: Settings = {
	currency: 'USD',
	monthlyBudget: null,
	theme: 'system',
	sortBy: 'nextBilling',
	sortDirection: 'asc'
};

export const CURRENCIES = [
	{ code: 'USD', symbol: '$', name: 'US Dollar' },
	{ code: 'EUR', symbol: '€', name: 'Euro' },
	{ code: 'GBP', symbol: '£', name: 'British Pound' },
	{ code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
	{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
	{ code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
	{ code: 'INR', symbol: '₹', name: 'Indian Rupee' },
	{ code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
	{ code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
	{ code: 'KRW', symbol: '₩', name: 'South Korean Won' }
];

export const COLOR_PALETTE = [
	'#ef4444',
	'#f97316',
	'#f59e0b',
	'#10b981',
	'#14b8a6',
	'#06b6d4',
	'#3b82f6',
	'#6366f1',
	'#8b5cf6',
	'#ec4899',
	'#e879f9',
	'#64748b'
];

export const EMOJI_PICKER = [
	'🎬', '🎵', '🎮', '💻', '☁️', '📰', '💪', '🍔',
	'📚', '💰', '🛒', '🔧', '📦', '🎧', '📱', '🎨',
	'🏠', '🚗', '✈️', '🎯', '🔒', '💡', '📊', '🎁'
];
