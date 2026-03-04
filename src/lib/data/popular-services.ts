import type { Category, BillingCycle } from '../types';

export interface PopularService {
	name: string;
	category: Category;
	icon: string;
	color: string;
	defaultCycle: BillingCycle;
}

export const POPULAR_SERVICES: PopularService[] = [
	{ name: 'Netflix', category: 'streaming', icon: '🎬', color: '#ef4444', defaultCycle: 'monthly' },
	{ name: 'Spotify', category: 'music', icon: '🎵', color: '#10b981', defaultCycle: 'monthly' },
	{ name: 'YouTube Premium', category: 'streaming', icon: '▶️', color: '#ef4444', defaultCycle: 'monthly' },
	{ name: 'Disney+', category: 'streaming', icon: '🏰', color: '#3b82f6', defaultCycle: 'monthly' },
	{ name: 'Hulu', category: 'streaming', icon: '📺', color: '#10b981', defaultCycle: 'monthly' },
	{ name: 'HBO Max', category: 'streaming', icon: '🎭', color: '#8b5cf6', defaultCycle: 'monthly' },
	{ name: 'Amazon Prime', category: 'streaming', icon: '📦', color: '#f59e0b', defaultCycle: 'yearly' },
	{ name: 'Apple TV+', category: 'streaming', icon: '🍎', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Apple Music', category: 'music', icon: '🍎', color: '#ec4899', defaultCycle: 'monthly' },
	{ name: 'Peacock', category: 'streaming', icon: '🦚', color: '#6366f1', defaultCycle: 'monthly' },
	{ name: 'Paramount+', category: 'streaming', icon: '⛰️', color: '#3b82f6', defaultCycle: 'monthly' },
	{ name: 'Crunchyroll', category: 'streaming', icon: '🍙', color: '#f97316', defaultCycle: 'monthly' },
	{ name: 'Xbox Game Pass', category: 'gaming', icon: '🎮', color: '#10b981', defaultCycle: 'monthly' },
	{ name: 'PlayStation Plus', category: 'gaming', icon: '🎮', color: '#3b82f6', defaultCycle: 'yearly' },
	{ name: 'Nintendo Switch Online', category: 'gaming', icon: '🎮', color: '#ef4444', defaultCycle: 'yearly' },
	{ name: 'Steam', category: 'gaming', icon: '🎮', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Adobe Creative Cloud', category: 'software', icon: '🎨', color: '#ef4444', defaultCycle: 'monthly' },
	{ name: 'Microsoft 365', category: 'software', icon: '💻', color: '#3b82f6', defaultCycle: 'yearly' },
	{ name: 'Google One', category: 'cloud', icon: '☁️', color: '#3b82f6', defaultCycle: 'monthly' },
	{ name: 'iCloud+', category: 'cloud', icon: '☁️', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Dropbox', category: 'cloud', icon: '💧', color: '#3b82f6', defaultCycle: 'monthly' },
	{ name: 'AWS', category: 'cloud', icon: '☁️', color: '#f59e0b', defaultCycle: 'monthly' },
	{ name: 'ChatGPT Plus', category: 'software', icon: '🤖', color: '#10b981', defaultCycle: 'monthly' },
	{ name: 'Claude Pro', category: 'software', icon: '🧠', color: '#f59e0b', defaultCycle: 'monthly' },
	{ name: 'GitHub Copilot', category: 'software', icon: '💻', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Notion', category: 'software', icon: '📝', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Figma', category: 'software', icon: '🎨', color: '#8b5cf6', defaultCycle: 'monthly' },
	{ name: 'Slack', category: 'software', icon: '💬', color: '#8b5cf6', defaultCycle: 'monthly' },
	{ name: 'Zoom', category: 'software', icon: '📹', color: '#3b82f6', defaultCycle: 'monthly' },
	{ name: 'New York Times', category: 'news', icon: '📰', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Wall Street Journal', category: 'news', icon: '📰', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'The Athletic', category: 'news', icon: '⚽', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Medium', category: 'news', icon: '📖', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'Peloton', category: 'fitness', icon: '🚴', color: '#ef4444', defaultCycle: 'monthly' },
	{ name: 'Strava', category: 'fitness', icon: '🏃', color: '#f97316', defaultCycle: 'monthly' },
	{ name: 'Headspace', category: 'fitness', icon: '🧘', color: '#f97316', defaultCycle: 'yearly' },
	{ name: 'Calm', category: 'fitness', icon: '🌊', color: '#3b82f6', defaultCycle: 'yearly' },
	{ name: 'DoorDash DashPass', category: 'food', icon: '🍔', color: '#ef4444', defaultCycle: 'monthly' },
	{ name: 'Uber One', category: 'food', icon: '🚗', color: '#64748b', defaultCycle: 'monthly' },
	{ name: 'HelloFresh', category: 'food', icon: '🥗', color: '#10b981', defaultCycle: 'weekly' },
	{ name: 'Coursera Plus', category: 'education', icon: '🎓', color: '#3b82f6', defaultCycle: 'yearly' },
	{ name: 'Duolingo Plus', category: 'education', icon: '🦉', color: '#10b981', defaultCycle: 'monthly' },
	{ name: 'Skillshare', category: 'education', icon: '📚', color: '#10b981', defaultCycle: 'yearly' },
	{ name: 'MasterClass', category: 'education', icon: '🎬', color: '#64748b', defaultCycle: 'yearly' },
	{ name: 'Mint Premium', category: 'finance', icon: '💰', color: '#10b981', defaultCycle: 'monthly' },
	{ name: 'YNAB', category: 'finance', icon: '💰', color: '#3b82f6', defaultCycle: 'yearly' },
	{ name: 'Amazon Prime Shopping', category: 'shopping', icon: '🛒', color: '#f59e0b', defaultCycle: 'yearly' },
	{ name: 'Costco Membership', category: 'shopping', icon: '🏪', color: '#ef4444', defaultCycle: 'yearly' },
	{ name: 'NordVPN', category: 'utilities', icon: '🔒', color: '#3b82f6', defaultCycle: 'yearly' },
	{ name: '1Password', category: 'utilities', icon: '🔑', color: '#3b82f6', defaultCycle: 'yearly' }
];

export function searchServices(query: string): PopularService[] {
	if (!query || query.length < 2) return [];
	const lower = query.toLowerCase();
	return POPULAR_SERVICES.filter((s) => s.name.toLowerCase().includes(lower)).slice(0, 5);
}
