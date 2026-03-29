<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Fit Architect

Fit Architect is a fitness and nutrition SPA for logging workouts, meals, body measurements, photos and session history. It uses React, TypeScript, Vite, Supabase and local persistence so the app stays usable even when network sync is not immediate.

## Features
- Daily dashboard for routine, habits and macros.
- Nutrition flow with meal logging, recipes, barcode/AI helpers and weekly summaries.
- Workout flow with routines, active sessions and post-workout summaries.
- Progress flow with metrics, photos and charts.
- Auth and per-user cloud sync with Supabase.
- Lazy-loaded screens and chunk splitting for faster initial load.

## Setup
1. Install dependencies with `npm install`.
2. Create `.env.local` from `.env.example`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. If you want AI-powered features, provide `GEMINI_API_KEY` in the runtime/build environment.
5. Start the app with `npm run dev`.

## Scripts
- `npm run dev` starts the Vite dev server.
- `npm run build` creates the production build.
- `npm run preview` serves the build locally.
- `npm run lint` runs the TypeScript check.

## Docs
- `docs/README.md` is the documentation index.
- `docs/active/PROJECT_OVERVIEW.md` is the current internal overview.
- `docs/active/FRONTEND_REDESIGN_MASTER_PLAN.md` is the active frontend redesign plan.
- `docs/archive/` contains historical snapshots only.

## Notes
- The app is organized in the repository root, not in `src/`.
- Supabase is required for auth and cloud sync.
- Local storage is used as a fast per-user fallback and for offline-friendly reloads.
