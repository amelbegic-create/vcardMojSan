# MojSan VCard Platform

A full-stack digital business card SaaS platform built with Next.js 14, Prisma, Neon PostgreSQL, and Vercel Blob.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Neon (PostgreSQL) via Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials provider)
- **Storage**: Vercel Blob
- **QR Codes**: qrcode npm package
- **Hosting**: Vercel

---

## Quick Start

### 1. Install Dependencies

```bash
cd vcard-platform
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon connection string (pooled) |
| `DIRECT_URL` | Neon direct connection string |
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your app URL (`http://localhost:3000` for dev) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token from dashboard |

### 3. Set Up Neon Database

1. Go to neon.tech and create a free project
2. Copy both Connection String (pooled) to DATABASE_URL
3. Copy Direct Connection String to DIRECT_URL

### 4. Run Database Migration

```bash
npx prisma migrate dev --name init
```

### 5. Seed Database

```bash
npm run seed
```

This creates:
- Admin user: admin@mojsan.ba / Admin@123 (change immediately!)
- 5 color templates
- 1 sample card at /card/demo-card

### 6. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

1. Push code to GitHub
2. Import repo at vercel.com/new
3. Add all environment variables in Vercel dashboard
4. Set NEXTAUTH_URL to your production URL
5. Deploy, then run: npm run seed

---

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run seed         # Seed database
npm run db:push      # Push schema (no migration)
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
```
