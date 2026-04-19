# Artesanía Oak & Iron

Premium artisan-furniture shop built with Next.js 14 (App Router), Supabase,
Tailwind + Shadcn-style UI primitives, and Framer Motion.

## Features

- **Hybrid catalog** — distinct flows for *Entrega Inmediata* (stock) and
  *Hecho a Medida* (custom, deposit-based, pipeline-tracked).
- **Manufacturing tracker** — six strict statuses
  (`Pendiente → Sourcing_Madera → En_Fabricacion → Control_Calidad → Acabado →
  Listo_Entrega`) rendered as an animated timeline for the client dashboard.
- **Wood configurator** — choose Roble / Nogal / Pino and finish; total and
  estimated delivery date update live.
- **Production history** — every status change logs a timestamped row via a
  Postgres trigger.
- **Dark / light mode** with warm wood tones (`#2D241E`, `#F5F5F0`, `#8B735B`).
- **Spanish UI**, English code and comments.

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Shadcn-style primitives · Framer Motion
· Supabase (Postgres + Auth) · React Hook Form · Zod · sonner · date-fns.

## Deploy to Vercel (one-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/thanatosoffx/Madera&project-name=artesania-oak-iron&repository-name=artesania-oak-iron&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&envDescription=Supabase%20project%20credentials)

When importing the repo on Vercel, pick the branch
`claude/setup-fullstack-orchestration-VXHSr` and provide the three runtime env
vars below (the `SUPABASE_DB_URL` is only used by the local `db:push`/`db:seed`
scripts and is not needed on Vercel):

| Variable                        | Where to find it                                  |
| ------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase dashboard → Project Settings → API → URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API settings → `anon` / `publishable`    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase API settings → `service_role` (secret)   |

Before the first deploy, apply the schema and seed once via Supabase Studio
(SQL editor): paste the contents of `supabase/schema.sql` and then
`supabase/seed.sql`. Vercel will auto-detect Next.js, run `next build`, and
expose a public URL on the next push.

## Local development

```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL

npm install
npm run db:push   # applies supabase/schema.sql
npm run db:seed   # loads supabase/seed.sql
npm run dev
```

## Scripts

| Script          | Description                                  |
| --------------- | -------------------------------------------- |
| `dev`           | Next.js dev server                           |
| `build`         | Production build                             |
| `start`         | Production server                            |
| `lint`          | Next.js lint                                 |
| `typecheck`     | `tsc --noEmit`                               |
| `db:push`       | Apply `supabase/schema.sql`                  |
| `db:seed`       | Run `supabase/seed.sql`                      |

## Project layout

```
app/                # App Router routes
  page.tsx          # Landing (hero + catalog)
  catalogo/         # Catalog + product detail
  configurador/     # Custom configurator
  cuenta/           # User dashboard + order detail
  admin/            # Workshop pipeline (admin-only)
  auth/             # Magic-link login, callback, signout
  api/orders/       # Order + status-transition routes
components/         # UI primitives + feature components
lib/                # Supabase, db helpers, pricing, delivery, validation
supabase/           # schema.sql + seed.sql
middleware.ts       # Session refresh on every request
```

## Key files

- `supabase/schema.sql` — enums, tables, RLS, status-change logging trigger.
- `lib/delivery.ts` — dynamic delivery-date formula.
- `lib/pricing.ts` — wood & finish surcharge table + 30% deposit.
- `components/material-configurator.tsx` — live configurator.
- `components/production-timeline.tsx` — Framer-Motion pipeline timeline.
- `app/page.tsx` — hybrid landing page integrating both flows.
