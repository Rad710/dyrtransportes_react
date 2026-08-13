# D y R Transportes — Web app (frontend)

A logistics platform in **daily production use** by a grain-transport company: recording every driver trip,
generating driver payrolls, and producing the reports the national transport regulator (DINATRAN) requires.

This is the **React + TypeScript frontend**. The backend lives in
**[dyrtransportes_flask](https://github.com/Rad710/dyrtransportes_flask)**.

🔗 **Live:** [rad710.pythonanywhere.com](https://rad710.pythonanywhere.com/)

<!-- Add a dashboard screenshot here once the demo instance is up:
![Dashboard](docs/screenshot.png) -->

## What it does

- **Trips & payrolls** — record shipments (driver, truck/trailer, route, product, weights, prices) and roll
  them into shipment payrolls and per-driver payrolls.
- **Routes & products** — manage freight routes and grain products with pricing.
- **Drivers** — driver records.
- **Dashboard** — profit charts and driver/product statistics.
- **DINATRAN reporting** — regulatory transport reports with Excel export.
- **Database backup** — trigger a live backup from the UI.
- Bilingual (Spanish / English), light & dark themes, JWT authentication.

## Stack

React 19 · TypeScript · Vite 7 · **Material UI 7** (with X Data Grid & X Charts) · Zustand ·
React Hook Form + Zod · React Router 7 · Axios · i18next. Package manager: **pnpm**.

## Project layout

Feature-first — each page owns its Zod `schema.ts`, i18next `translations.ts`, `utils.ts`, and a
`components/` dir (`*DataTable`, `*FormDialog`):

```
src/pages/  auth · home · shipment-payrolls · driver-payrolls · route-product · driver · dinatran · user-profile
```

Routes are lazy-loaded with public/protected guards; a Zustand `authStore` decodes the JWT (with an
expiry-check interval) and hydrates on load; an Axios interceptor injects the bearer token.

## Run

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

`.env`:

```env
VITE_API_URL=http://localhost:8080   # the Flask backend
VITE_DEBUG=1
```

## Build & deploy

```bash
pnpm build        # static output in dist/
```

Self-hosted with Docker (multi-stage Node build → nginx) behind a **solo-built Jenkins pipeline**: ESLint +
SonarQube quality gates, multi-architecture images, automatic GitHub releases, and remote deploy over SSH.
The API URL is injected at container start (`VITE_API_URL_PLACEHOLDER`), so one image runs in any
environment.

Backend: **[dyrtransportes_flask](https://github.com/Rad710/dyrtransportes_flask)**.
