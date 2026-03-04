# Subscription Tracker

A lightweight, offline-capable Progressive Web App that helps you track recurring subscriptions, visualize spending, and stay on top of upcoming renewals. No backend, no auth — all data lives in `localStorage`.

## Features

- **Dashboard** — Monthly/yearly totals, budget tracking, category breakdown donut chart, and upcoming renewals at a glance
- **Subscription Management** — Add, edit, pause, and delete subscriptions with search and category filters
- **Smart Totals** — Normalizes all billing cycles (weekly, monthly, quarterly, semi-annual, yearly) to comparable monthly and yearly amounts
- **Budget Tracking** — Set a monthly budget and get visual feedback when approaching or exceeding it
- **Popular Service Autofill** — Type a service name and auto-fill icon, category, and color from a built-in dictionary
- **Data Export/Import** — Back up and restore your data as JSON files
- **PWA** — Installable on mobile, works fully offline after first visit
- **Dark Mode** — System, light, and dark theme support

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit (static adapter) |
| Styling | Tailwind CSS |
| Persistence | localStorage |
| PWA | vite-plugin-pwa (Workbox) |
| Icons | Lucide Svelte |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment

The app builds to static files and can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Privacy

All data stays on your device. Nothing is sent to any server.
