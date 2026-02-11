# Migration to Vercel & Postgres

This guide outlines the steps to complete the migration of **Somatic Canticles** to Vercel with a PostgreSQL database.

## 1. Prerequisites

Ensure you have the following installed:
- [Bun](https://bun.sh/) (v1.0+)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, but recommended)

## 2. Vercel Project Setup

1.  **Import Project**: Go to [Vercel Dashboard](https://vercel.com/new) and import this repository.
2.  **Framework Preset**: Select **Next.js**.
3.  **Root Directory**: `./` (default).

## 3. Database Setup (Vercel Postgres)

1.  In your Vercel Project Dashboard, go to **Storage** tab.
2.  Click **Connect Store** -> **Create New** -> **Postgres**.
3.  Give it a name (e.g., `somatic-db`) and region.
4.  Once created, go to the **.env.local** tab in the database page.
5.  **Copy** the environment variables snippet (it includes `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.).
6.  **Paste** these into your local `.env.local` file in the project root.

> **Note**: If you don't have a `.env.local` file, create one.

## 4. Environment Variables

Ensure your `.env.local` includes the following (in addition to Vercel Postgres vars):

```env
# Auth Secrets (Generate new ones if needed)
JWT_SECRET=your-secure-jwt-secret-here-at-least-32-chars
CRON_SECRET=your-cron-secret

# Database (From Vercel)
POSTGRES_URL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

## 5. Database Migration & Seeding

Once `.env.local` is set up:

1.  **Generate Migrations** (if not already done):
    ```bash
    bun run db:generate
    ```

2.  **Push Schema to DB**:
    ```bash
    bun run db:migrate
    # or if you prefer direct push to sync schema
    bun x drizzle-kit push
    ```

3.  **Seed Data**:
    ```bash
    bun run db:seed
    ```
    This will Create:
    - Admin user: `admin@somatic-canticles.local` / `SomaticDev44!`
    - 15 Test users: `user01@example.com` / `Pass01!`, etc.

## 6. Local Development

Start the development server:

```bash
bun run dev
```

The API is now available at `http://localhost:3000/api/...`.

## 7. Deployment

Deploy to Vercel:

```bash
git add .
git commit -m "Migrate to Vercel Postgres"
git push
```

Vercel will automatically build and deploy. Ensure you have added the Environment Variables in the Vercel Project Settings (Settings -> Environment Variables) matching your local `.env.local`.

## 8. Cleanup

Once verified, you can delete the `workers/` directory.
