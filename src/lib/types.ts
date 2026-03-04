export type Category =
	| 'streaming'
	| 'music'
	| 'gaming'
	| 'software'
	| 'cloud'
	| 'news'
	| 'fitness'
	| 'food'
	| 'education'
	| 'finance'
	| 'shopping'
	| 'utilities'
	| 'other';

export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'semi-annual' | 'yearly';

export type ThemeMode = 'system' | 'light' | 'dark';

export type SortField = 'name' | 'amount' | 'nextBilling' | 'category';

export type SortDirection = 'asc' | 'desc';

export interface Subscription {
	id: string;
	name: string;
	category: Category;
	amount: number;
	currency: string;
	cycle: BillingCycle;
	startDate: string;
	nextBillingDate: string;
	icon: string | null;
	color: string;
	notes: string;
	isPaused: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Settings {
	currency: string;
	monthlyBudget: number | null;
	theme: ThemeMode;
	sortBy: SortField;
	sortDirection: SortDirection;
}
