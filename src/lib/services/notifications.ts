import type { Subscription } from '../types';
import { daysUntil } from '../utils/dates';

export async function requestNotificationPermission(): Promise<boolean> {
	if (!('Notification' in window)) return false;
	if (Notification.permission === 'granted') return true;
	if (Notification.permission === 'denied') return false;
	const result = await Notification.requestPermission();
	return result === 'granted';
}

export function scheduleRenewalNotifications(subscriptions: Subscription[]): void {
	if (!('Notification' in window) || Notification.permission !== 'granted') return;

	const active = subscriptions.filter((s) => !s.isPaused);

	for (const sub of active) {
		const days = daysUntil(sub.nextBillingDate);
		if (days === 1) {
			// Due tomorrow — notify now
			new Notification('Upcoming Renewal', {
				body: `${sub.name} renews tomorrow`,
				icon: '/icons/icon-192.svg'
			});
		} else if (days > 1 && days <= 2) {
			// Schedule for roughly 1 day before
			const ms = (days - 1) * 24 * 60 * 60 * 1000;
			setTimeout(() => {
				if (Notification.permission === 'granted') {
					new Notification('Upcoming Renewal', {
						body: `${sub.name} renews tomorrow`,
						icon: '/icons/icon-192.svg'
					});
				}
			}, ms);
		}
	}
}
