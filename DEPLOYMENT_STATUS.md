# 🚀 Deployment Status

## ✅ Successfully Deployed

### 1. Cloudflare Pages (Frontend)
- **Status:** ✅ Live
- **URL:** https://d9945c61.somatic-canticles.pages.dev
- **Build:** Static export from Next.js 16
- **Assets:** 248 files uploaded (2.23 sec)

### 2. Cloudflare Workers (API)
- **Status:** ✅ Deployed
- **URL:** https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev
- **Resources Created:**
  - D1 Database: `somatic-canticles-db`
  - R2 Bucket: `canticle-audio`
  - R2 Bucket: `canticle-images`
- **Secrets Set:**
  - ✅ JWT_SECRET

## ⚠️ Pending Tasks

### Database Migrations
Some migrations need to be applied manually due to schema evolution:

```bash
cd workers

# Check current migration status
wrangler d1 migrations list somatic-canticles-db --env production --remote

# Apply pending migrations
wrangler d1 migrations apply somatic-canticles-db --env production --remote
```

**Note:** Migration 0004 may fail if `email_verified` column already exists. This is expected on existing databases.

### Database Seeding
Populate chapters and initial data:

```bash
# Option 1: Direct SQL (recommended for production)
wrangler d1 execute somatic-canticles-db --env production --remote --file=./migrations/seed_chapters.sql

# Option 2: Via API endpoint (create a seed endpoint)
# POST https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev/admin/seed
```

### Environment Variables for Pages
Set these in Cloudflare Pages dashboard:

| Variable | Value |
|----------|-------|
| `NEXTAUTH_SECRET` | (generate with `openssl rand -base64 32`) |
| `AUTH_SECRET` | (same as above) |
| `NEXTAUTH_URL` | https://somatic-canticles.pages.dev |
| `NEXT_PUBLIC_API_URL` | https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev |

## 🔗 Service URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://d9945c61.somatic-canticles.pages.dev |
| **API** | https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev |
| **Health Check** | https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev/health |

## 🧪 Testing the Deployment

### Test API Health
```bash
curl https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev/health
```

### Test Frontend
Open https://d9945c61.somatic-canticles.pages.dev in your browser

## 📋 Next Steps Checklist

- [ ] Apply remaining database migrations
- [ ] Seed database with chapter content
- [ ] Set Pages environment variables
- [ ] Configure custom domain (optional)
- [ ] Test auth flows
- [ ] Verify chapter unlocking
- [ ] Upload canticle audio to R2

## 🐛 Known Issues

1. **Migrations:** Some migrations may fail on existing columns - this is expected
2. **Database:** Currently empty - needs seeding
3. **Auth:** Will not work until database is seeded and env vars are set

## 📝 Notes

- Database is D1 (SQLite at edge) - very fast, globally distributed
- R2 buckets are ready for audio/image storage
- Workers deployed with all routes configured
- Pages deployed with static export

Last updated: 2026-02-09
