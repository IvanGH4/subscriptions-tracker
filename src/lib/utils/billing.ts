import type { BillingCycle, Subscription } from '../types';

export function toMonthly(amount: number, cycle: BillingCycle): number {
	switch (cycle) {
		case 'weekly':
			return (amount * 52) / 12;
		case 'monthly':
			return amount;
		case 'quarterly':
			return amount / 3;
		case 'semi-annual':
			return amount / 6;
		case 'yearly':
			return amount / 12;
	}
}

export function toYearly(amount: number, cycle: BillingCycle): number {
	switch (cycle) {
		case 'weekly':
			return amount * 52;
		case 'monthly':
			return amount * 12;
		case 'quarterly':
			return amount * 4;
		case 'semi-annual':
			return amount * 2;
		case 'yearly':
			return amount;
	}
}

export function calculateNextBillingDate(startDate: string, cycle: BillingCycle): string {
	const start = new Date(startDate + 'T00:00:00');
	const now = new Date();
	now.setHours(0, 0, 0, 0);

	let next = new Date(start);

	while (next < now) {
		switch (cycle) {
			case 'weekly':
				next.setDate(next.getDate() + 7);
				break;
			case 'monthly':
				next.setMonth(next.getMonth() + 1);
				break;
			case 'quarterly':
				next.setMonth(next.getMonth() + 3);
				break;
			case 'semi-annual':
				next.setMonth(next.getMonth() + 6);
				break;
			case 'yearly':
				next.setFullYear(next.getFullYear() + 1);
				break;
		}
	}

	return next.toISOString().split('T')[0];
}

export function getTotalMonthly(subscriptions: Subscription[]): number {
	return subscriptions
		.filter((s) => !s.isPaused)
		.reduce((sum, s) => sum + toMonthly(s.amount, s.cycle), 0);
}

export function getTotalYearly(subscriptions: Subscription[]): number {
	return subscriptions
		.filter((s) => !s.isPaused)
		.reduce((sum, s) => sum + toYearly(s.amount, s.cycle), 0);
}
