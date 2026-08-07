# Alpha Fellowship Uganda — Digital Platform

A production-ready church CMS, public website, and members portal for **Alpha Fellowship Uganda**.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, Server Components)
- **Tailwind CSS v4** + **shadcn/ui**
- **PostgreSQL** (Supabase) + **Prisma ORM**
- **Auth.js** (email/password + Google OAuth)
- **Cloudinary** (media storage)
- **YouTube Data API** (live streams & sermons)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required for local development:
- `DATABASE_URL` — Supabase pooler connection string (port 6543, for runtime)
- `DIRECT_URL` — Supabase direct connection string (port 5432, for migrations)
- `AUTH_SECRET` — Generate with `openssl rand -base64 32`

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database**
3. Copy the **Transaction pooler** URI → `DATABASE_URL`
4. Copy the **Direct connection** URI → `DIRECT_URL`

### 4. Set up the database

```bash
npx prisma migrate deploy
npm run db:seed
```

For local development with migration creation:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   ├── member/            # Members portal
│   ├── church/admin/      # Admin dashboard & CMS
│   └── api/               # Route handlers
├── components/
│   ├── public/            # Public site components
│   ├── admin/             # Admin dashboard components
│   ├── member/            # Members portal components
│   └── ui/                # shadcn/ui design system
├── lib/
│   ├── content/           # Verified church content (fallback)
│   ├── auth/              # Auth.js configuration
│   ├── services/          # Business logic services
│   └── validations/       # Zod schemas
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Development seed data
docs/
└── CONTENT_INVENTORY.md   # Verified Alpha Fellowship content
```

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 0 — Discovery | ✅ Complete | Content audit from alphafellowshipug.com |
| 1 — Design System | ✅ Complete | Brand tokens, typography, components |
| 2 — Foundation | ✅ Complete | Next.js, Prisma schema, env config |
| 3 — Public Website | ✅ Complete | Homepage + About, Gatherings, Contact, Give |
| 4 — CMS / Admin | ✅ Complete | Auth.js login, admin dashboard, site settings |
| 5 — Members Portal | ✅ Complete | Dashboard, profile, membership application |
| 6 — Pastoral Care | ✅ Complete | Prayer & counselling request systems |
| 7 — Church Operations | ✅ Complete | Events, ministries, campaigns |
| 8 — Payments | ✅ Complete | Giving page, confirmations, admin payment CMS |
| 9 — Integrations | ✅ Complete | YouTube, Cloudinary, Resend email |
| 10 — Security | ✅ Complete | Headers, rate limits, validation, audit log |
| 11–14 | ⏳ Pending | Content, testing, deployment polish |

## Content Source of Truth

All Alpha Fellowship organizational information is sourced from [alphafellowshipug.com](https://alphafellowshipug.com). See `docs/CONTENT_INVENTORY.md` for the full audit. Missing information uses CMS placeholders — never invented facts.

## Deployment

Optimized for **Vercel** + **Supabase** + **Cloudinary**:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`)
4. Optional integrations: `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`, Cloudinary vars, `RESEND_API_KEY`, `EMAIL_FROM`
5. Run `npx prisma migrate deploy` against your Supabase database (uses `DIRECT_URL`)
6. Run `npm run db:seed` to create the admin user and initial content
7. Staff sign in at `/church/admin/login` (hidden URL). Members use `/members` on the public site to register or sign in at `/member/login`.
