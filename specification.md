# Subscription Tracker — Product Specification

## Overview

A lightweight, offline-capable Progressive Web App built with SvelteKit that helps users track recurring subscriptions, visualize spending, and stay on top of upcoming renewals. No backend, no auth — all data lives in `localStorage`.

---

## Core Principles

- **Mobile-first**: designed for one-handed use on small screens, with touch-friendly targets and swipe gestures.
- **Zero friction**: no sign-up, no loading spinners, no server dependency. Open it and start tracking.
- **Offline by default**: full PWA with service worker caching. Works without connectivity after first visit.
- **Privacy-respecting**: all data stays on-device. Nothing leaves the browser.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit (static adapter) |
| Styling | Tailwind CSS |
| Persistence | localStorage (JSON serialization) |
| PWA | vite-plugin-pwa (Workbox) |
| Icons | Lucide Svelte |
| Deployment | Any static host (Vercel, Netlify, GitHub Pages) |

---

## Data Model

### Subscription

```ts
interface Subscription {
  id: string;               // crypto.randomUUID()
  name: string;             // e.g. "Netflix"
  category: Category;       // enum value
  amount: number;           // price per cycle
  currency: string;         // ISO 4217, default "USD"
  cycle: "weekly" | "monthly" | "quarterly" | "semi-annual" | "yearly";
  startDate: string;        // ISO date (YYYY-MM-DD)
  nextBillingDate: string;  // ISO date, auto-calculated
  icon: string | null;      // emoji or URL (optional)
  color: string;            // hex color for UI accent
  notes: string;            // free text
  isPaused: boolean;        // excluded from totals when true
  createdAt: string;        // ISO datetime
  updatedAt: string;        // ISO datetime
}
```

### Category (enum)

`streaming` · `music` · `gaming` · `software` · `cloud` · `news` · `fitness` · `food` · `education` · `finance` · `shopping` · `utilities` · `other`

Each category has a default emoji and color for quick visual scanning.

### Settings

```ts
interface Settings {
  currency: string;         // default display currency
  monthlyBudget: number | null;  // optional spending cap
  theme: "system" | "light" | "dark";
  sortBy: "name" | "amount" | "nextBilling" | "category";
  sortDirection: "asc" | "desc";
}
```

---

## Pages & Routes

### `/` — Dashboard

The home screen. Shows at a glance:

- **Monthly total** and **yearly total** (large, prominent numbers at top).
- **Budget bar**: if a monthly budget is set, a progress bar showing current spend vs. budget with color coding (green → amber → red).
- **Upcoming renewals**: a compact list of the next 5 subscriptions due, showing name, amount, and days until billing.
- **Category breakdown**: a donut/ring chart showing spend distribution by category.
- **Quick stats row**: total active subscriptions count, average cost per subscription, most expensive subscription.

### `/subscriptions` — Subscription List

Full list of all subscriptions with:

- Search bar (filters by name in real time).
- Category filter chips (horizontal scroll, multi-select).
- Toggle to show/hide paused subscriptions.
- Each card shows: icon/emoji, name, amount normalized to monthly, cycle badge, next billing date, category color stripe.
- Swipe left on a card to reveal **Edit** and **Delete** actions (with confirmation).
- Floating Action Button (FAB) at bottom-right to add a new subscription.

### `/subscriptions/new` — Add Subscription

A full-screen form, optimized for mobile:

- **Name** — text input with autocomplete suggestions from a built-in list of popular services (Netflix, Spotify, AWS, etc.) that auto-fills icon, category, and color.
- **Amount** — numeric input with currency selector.
- **Billing cycle** — segmented control (weekly / monthly / quarterly / semi-annual / yearly).
- **Start date** — date picker, defaults to today.
- **Category** — scrollable chip selector with emoji labels.
- **Color** — small palette of preset colors.
- **Icon** — emoji picker (compact grid of common choices).
- **Notes** — optional expandable textarea.
- **Save** button (sticky at bottom of viewport).

### `/subscriptions/[id]/edit` — Edit Subscription

Same form as Add, pre-filled with existing data. Includes a **Pause/Resume** toggle and a **Delete** button at the bottom.

### `/settings` — Settings

- Currency selector.
- Monthly budget input.
- Theme toggle (system / light / dark).
- Default sort preference.
- **Export data** — downloads all subscriptions as a JSON file.
- **Import data** — uploads a JSON file and merges/replaces data (with confirmation dialog).
- **Clear all data** — destructive action with double confirmation.
- App version and "About" info.

---

## Features in Detail

### 1. Smart Totals

All totals normalize subscriptions to a common period:

- A $120/year subscription shows as $10.00/mo in the monthly view.
- A $5/week subscription shows as $21.67/mo and $260.00/yr.
- Paused subscriptions are excluded from totals but remain visible (greyed out).

Normalization formulas:

| Cycle | → Monthly | → Yearly |
|---|---|---|
| Weekly | amount × 52 / 12 | amount × 52 |
| Monthly | amount | amount × 12 |
| Quarterly | amount / 3 | amount × 4 |
| Semi-annual | amount / 6 | amount × 2 |
| Yearly | amount / 12 | amount |

### 2. Upcoming Renewal Alerts

- On the dashboard, the "Upcoming" section highlights subscriptions billing within the next 7 days.
- Color coding: due today (red), due within 3 days (amber), due within 7 days (default).
- If PWA notifications are granted, schedule local notifications 1 day before each renewal.

### 3. Popular Service Autofill

A built-in dictionary of ~50 popular services with pre-configured:

- Name, category, default icon (emoji), accent color.
- User types "Net..." → suggestion dropdown shows "Netflix" → tap to auto-fill fields.
- User can override any auto-filled value.

### 4. Data Export & Import

- **Export**: serializes all subscriptions + settings to a formatted JSON file, triggers browser download.
- **Import**: accepts a JSON file, validates schema, shows a preview diff (new / updated / unchanged counts), and asks for confirmation before applying.
- This doubles as a manual backup/restore and a device-to-device transfer mechanism.

### 5. Budget Tracking

- Optional monthly budget set in Settings.
- Dashboard shows a progress bar: `current monthly total / budget`.
- Visual states: under 75% (green), 75–100% (amber), over 100% (red with pulse animation).
- If over budget, a banner appears: "You're $X.XX over your $Y.YY/mo budget."

### 6. Category Insights

- Donut chart on the dashboard, built with SVG (no heavy chart library).
- Tapping a segment filters the subscription list to that category.
- Below the chart: a ranked list of categories by total monthly spend.

### 7. PWA Capabilities

- `manifest.json` with app name, icons (192px, 512px), theme color, `display: standalone`.
- Service worker via `vite-plugin-pwa` with precaching of all static assets.
- Installable on Android and iOS (Add to Home Screen).
- Offline indicator banner when connectivity is lost.

### 8. Theme Support

- Three modes: System (follows OS preference), Light, Dark.
- CSS variables for all colors, toggled via a `data-theme` attribute on `<html>`.
- Smooth transitions between themes.

---

## UI / UX Guidelines

### Layout

- Max content width: `448px` (centered on larger screens with subtle background).
- Bottom navigation bar with 3 tabs: **Dashboard**, **Subscriptions**, **Settings**.
- No hamburger menus. Everything reachable in ≤ 2 taps.

### Touch Targets

- Minimum tap target: `44px × 44px` (WCAG 2.5.8).
- Generous padding on form inputs (`12px` vertical minimum).
- FAB size: `56px` diameter.

### Animations

- Page transitions: subtle slide (left/right based on navigation direction).
- List items: staggered fade-in on load.
- Deletion: item slides out to the left before removal.
- Numbers (totals): count-up animation on dashboard load.
- Keep all animations under 300ms. Respect `prefers-reduced-motion`.

### Empty States

- Dashboard with no subscriptions: friendly illustration placeholder + "Add your first subscription" CTA button.
- Filtered list with no results: "No subscriptions match your filters" with a "Clear filters" link.

### Accessibility

- Semantic HTML (`nav`, `main`, `section`, `article`, `button` — no `div` buttons).
- ARIA labels on icon-only buttons.
- Focus-visible outlines on all interactive elements.
- Color contrast ratio ≥ 4.5:1 for all text.
- Screen reader announcements for dynamic content changes (totals, alerts).

---

## File Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Shell: bottom nav, theme provider
│   ├── +page.svelte             # Dashboard
│   ├── subscriptions/
│   │   ├── +page.svelte         # Subscription list
│   │   ├── new/
│   │   │   └── +page.svelte     # Add subscription form
│   │   └── [id]/
│   │       └── edit/
│   │           └── +page.svelte # Edit subscription form
│   └── settings/
│       └── +page.svelte         # Settings page
├── lib/
│   ├── stores/
│   │   ├── subscriptions.ts     # Writable store + localStorage sync
│   │   └── settings.ts          # Settings store + localStorage sync
│   ├── services/
│   │   ├── storage.ts           # localStorage read/write/export/import
│   │   └── notifications.ts     # PWA notification scheduling
│   ├── data/
│   │   └── popular-services.ts  # Autofill dictionary
│   ├── utils/
│   │   ├── currency.ts          # Formatting helpers
│   │   ├── billing.ts           # Normalization & next-date calculations
│   │   └── dates.ts             # Relative date helpers ("in 3 days")
│   └── components/
│       ├── SubscriptionCard.svelte
│       ├── CategoryChip.svelte
│       ├── DonutChart.svelte
│       ├── BudgetBar.svelte
│       ├── EmptyState.svelte
│       ├── SearchBar.svelte
│       ├── BottomNav.svelte
│       └── FAB.svelte
├── app.css                      # Tailwind directives + CSS variables
└── app.html                     # HTML shell
static/
├── icons/                       # PWA icons (192, 512)
├── favicon.svg
└── manifest.json
```

---

## localStorage Schema

Two keys used:

| Key | Value |
|---|---|
| `sub-tracker:subscriptions` | `Subscription[]` (JSON) |
| `sub-tracker:settings` | `Settings` (JSON) |

On every mutation, the full array/object is serialized and written. On app boot, both keys are read and hydrated into Svelte stores. If keys are missing or corrupt, defaults are applied silently.

---

## Future Considerations (Out of Scope for v1)

- Multi-currency support with live exchange rates.
- Shared/family subscription splitting.
- Receipt/invoice photo attachment (via IndexedDB for binary storage).
- Calendar integration (`.ics` export of renewal dates).
- Subscription price change history tracking.
- Widget support for Android/iOS home screens.