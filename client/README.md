# FinGuard AI — Frontend Prototype

A premium fintech dashboard UI for small business owners to manage invoices, payments,
expenses, credit, and AI-driven financial insights. **Frontend only** — all data is
mock/local state, there is no backend, database, or authentication.

Tagline: *Smarter Finance. Stronger Business.*

## Tech stack

- React 19 + Vite
- Tailwind CSS 3 (custom navy/teal/indigo fintech theme)
- Recharts (charts)
- lucide-react (icons)
- react-router-dom (HashRouter, so it works on any static host with no server config)

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # optional, serves the built dist/ folder locally
```

The production build is written to `dist/`.

## Deploy

The app is a static site (HashRouter avoids the need for server-side rewrite rules),
so any of these work with zero configuration:

- **Vercel**: `vercel` in this folder, or drag-and-drop the `dist/` folder at vercel.com/new
- **Netlify**: drag-and-drop `dist/` at app.netlify.com/drop, or connect the repo
  (build command `npm run build`, publish directory `dist`)
- **GitHub Pages**: push `dist/` contents to a `gh-pages` branch, or use the
  `gh-pages` npm package

## Project structure

```
src/
  components/     Shared UI: MetricCard, AdvisorPanel, Card, ui.jsx (modals, toasts, badges, progress rings)
  layout/         Sidebar, Topbar, AppShell
  pages/          Dashboard, Invoices, Expenses, Transactions, Customers,
                  Payments, Credit, Advisor, Reports, Settings
  data/           mockData.js — all mock/demo data lives here
```

## Notes

- All figures are illustrative (INR, Indian business context) — edit `src/data/mockData.js`
  to change amounts, names, or add more rows.
- Sidebar is collapsible on desktop and becomes a slide-out drawer on mobile.
- The "AI Advisor" pages use canned responses (`src/pages/Advisor.jsx`) — swap in a
  real API call when you're ready to connect a backend.
- To make this deployable *with* real data, you'd add a backend (auth, database, and
  API routes) and replace the imports from `mockData.js` with real API calls — the
  component structure is already set up to make that swap straightforward.
