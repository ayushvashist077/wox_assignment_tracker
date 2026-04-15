# Assignment Tracker

This app now uses Vite for local development and production builds, while keeping the Firebase hosting output in `build/`.

## Scripts

- `npm start` or `npm run dev` starts the Vite dev server.
- `npm run build` creates a production bundle in `build/`.
- `npm run preview` serves the production bundle locally.
- `npm test` runs the Vitest test suite once.

## Environment Variables

The project still accepts the existing `REACT_APP_*` Firebase keys through Vite's `envPrefix` setting, so you do not need to rename your current `.env` values to start the app.
