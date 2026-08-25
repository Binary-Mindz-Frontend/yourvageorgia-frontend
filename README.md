# Solenne Frontend

Next.js frontend for **Solenne** — a private membership platform offering preferred rates and privileges across a global network of longevity and beauty destinations.

## Stack

- **Next.js** 16 (App Router) + **React** 19 + **TypeScript**
- **Tailwind CSS** 4 + Radix UI
- **Google Maps** (`@react-google-maps/api`)
- **Stripe** (checkout / subscriptions)
- **Docker** multi-stage build (Node 24 Alpine, standalone output)

## Features

- Public site: home, partner network, partnership, membership & checkout
- Auth: login, member registration, OTP, forgot / reset password
- Member profile and favourites
- Admin dashboard: overview, partners, categories, activities, members, access codes

## Getting started

### Prerequisites

- Node.js 24+
- npm
- A running backend API (see `NEXT_PUBLIC_BASE_API`)

### Setup

```bash
cp .env.example .env   # or create .env manually
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Production build           |
| `npm run start`   | Serve production build     |
| `npm run lint`    | Run ESLint                 |
| `npm run analyze` | Bundle analyzer build      |

## Environment variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_BASE_API=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
PACKAGE_NAME=
```

| Variable                          | Purpose                                      |
| --------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_BASE_API`            | Backend API base URL (all API calls)         |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (partner map)            |
| `PACKAGE_NAME`                    | Docker image / deploy folder name            |

## Project structure

```
app/
  (auth)/          # Login, registration, OTP, password reset
  (main)/          # Public & member pages (home, network, checkout, profile)
  admin/           # Admin entry
  dashboard/       # Admin dashboard
components/        # Shared UI (navbar, drawers, shadcn-style primitives)
context/           # City & user context
hooks/             # Shared React hooks
lib/               # Token helpers, utils
providers/         # App-wide providers
services/          # API clients (auth, partners, stripe, etc.)
types/             # Shared TypeScript types
```

## Docker

Build and run with Compose (expects an external Docker network `georgia_app_network`):

```bash
docker compose up --build
```

Or build the image directly (pass build-time `NEXT_PUBLIC_*` args as needed):

```bash
docker build \
  --build-arg NEXT_PUBLIC_BASE_API=... \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=... \
  -t solenne-frontend .
```

The app listens on port **3000**.

## CI / CD

GitHub Actions (`.github/workflows/deploy.yaml`):

1. **CI** — install + build on every PR and push
2. **Build & push** — Docker image to Docker Hub on `main`
3. **Deploy** — pull and restart the container on the target host

Required repository secrets mirror the env vars above, plus `DOCKER_USERNAME` / `DOCKER_PASSWORD`.
