# Delever — CRM landing page

Production landing page for Delever's cloud CRM/delivery-management platform. Next.js (App Router) + TypeScript + Tailwind, with Uzbek/Russian i18n and a lead-capture form wired to amoCRM.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/uz` or `/ru` based on the browser's language.

## Structure

- `app/[locale]/` — pages, layout, global styles (locale-aware routing via `next-intl`)
- `app/api/lead/route.ts` — receives lead form submissions, forwards to amoCRM
- `components/` — one component per landing page block (Hero, Stats, Clients, Features, WorldMap, Footer, ...)
- `lib/constants.ts` — countries, modules, stats, order-range options shown on the page
- `lib/validation.ts` — shared zod schema for the lead form (client + server)
- `lib/amocrm.ts` — amoCRM API client
- `messages/uz.json`, `messages/ru.json` — all UI copy. AI-drafted; get a native-speaker pass before launch
- `public/data/countries-110m.json` — world topojson (from the `world-atlas` package) used by the geography map

## amoCRM setup

The lead form works out of the box in a "logged, not sent" mode. To actually push leads into amoCRM, copy `.env.example` to `.env.local` and fill in:

```
AMOCRM_SUBDOMAIN=your-subdomain
AMOCRM_ACCESS_TOKEN=your-long-lived-token
```

See `.env.example` for where to generate the token. Until these are set, submissions are logged to the server console instead of failing, so nothing is lost in development.

## Content notes

- The "Our clients" section uses placeholder logo tiles (no real client logos were available) — swap them in `components/ClientsSection.tsx` when assets are ready.
- Footer social links are placeholders (`href="#"`) — point them at real Telegram/website URLs in `components/Footer.tsx`.

## Build

```bash
npm run build
npm run lint
```
