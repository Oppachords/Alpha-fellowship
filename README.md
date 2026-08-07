# Alpha Fellowship Uganda — Digital Platform

A production-ready church CMS, public website, and members portal for **Alpha Fellowship Uganda**.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, Server Components)
- **Tailwind CSS v4** + **shadcn/ui**
- **PostgreSQL** (Neon) + **Prisma ORM**
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
- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — Generate with `openssl rand -base64 32`

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   ├── (auth)/            # Login, register, password reset
│   ├── (member)/          # Members portal
│   ├── (admin)/           # Admin dashboard & CMS
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
| 3 — Public Website | 🔄 In Progress | Homepage built; other pages pending |
| 4 — CMS / Admin | ⏳ Pending | Dashboard, content management |
| 5 — Members Portal | ⏳ Pending | Registration, profiles, dashboard |
| 6 — Pastoral Care | ⏳ Pending | Prayer & counselling systems |
| 7 — Church Operations | ⏳ Pending | Events, ministries, campaigns |
| 8 — Payments | ⏳ Pending | MTN, Airtel, Bank configuration |
| 9 — Integrations | ⏳ Pending | YouTube, Cloudinary, Email |
| 10–14 | ⏳ Pending | Security, content, testing, deployment |

## Content Source of Truth

All Alpha Fellowship organizational information is sourced from [alphafellowshipug.com](https://alphafellowshipug.com). See `docs/CONTENT_INVENTORY.md` for the full audit. Missing information uses CMS placeholders — never invented facts.

## Deployment

Optimized for **Vercel** + **Neon** + **Cloudinary**:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Run `npx prisma migrate deploy` for production database
