export function daysUntil(dateStr: string): number {
	const target = new Date(dateStr + 'T00:00:00');
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function relativeDate(dateStr: string): string {
	const days = daysUntil(dateStr);
	if (days === 0) return 'Today';
	if (days === 1) return 'Tomorrow';
	if (days < 0) return `${Math.abs(days)} days ago`;
	if (days <= 7) return `In ${days} days`;
	if (days <= 30) return `In ${Math.ceil(days / 7)} weeks`;
	return formatDate(dateStr);
}

export function formatDate(dateStr: string): string {
	const date = new Date(dateStr + 'T00:00:00');
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

export function toISODate(date: Date = new Date()): string {
	return date.toISOString().split('T')[0];
}
