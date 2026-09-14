# Fontpair.co marketing site

A standalone landing page for Fontpair.co — separate from the app in the
repo root (`src/`), on its own lightweight stack (Vite + React + Tailwind
CSS v4) since a marketing page doesn't need Chakra UI or Supabase.

## Getting started

```bash
cd marketing
npm install
npm run dev
```

## Structure

- `src/components/` — one component per landing-page section (`Nav`,
  `Hero`, `Features`, `ColorShowcase`, `Pricing`, `Footer`)
- `src/config.ts` — `APP_URL`, the link every "Open the app" / "Get
  started" button points to. Update it once the app has a final
  production domain.

## Build

```bash
npm run build
```

Outputs to `marketing/dist`. Not yet wired into a deploy workflow —
add one (e.g. a second GitHub Pages/Vercel target) once you've decided
how the marketing site and the app should be split across domains or
paths.
