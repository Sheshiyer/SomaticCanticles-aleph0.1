# 🚀 Deployment Status

## ✅ Successfully Deployed

### 1. Cloudflare Pages (Frontend)
- **Status:** ✅ Live
- **Primary URL:** https://1319.tryambakam.space (custom domain - pending setup)
- **Current URL:** https://f94979b8.somatic-canticles.pages.dev
- **Build:** Static export from Next.js 16
- **Assets:** 248 files uploaded (2.23 sec)
- **Custom Domain Setup:** See [CUSTOM_DOMAIN_SETUP.md](./CUSTOM_DOMAIN_SETUP.md)

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

### Secrets Management (NEW)

We now use a centralized secrets management system. See [workers/SECRETS.md](../workers/SECRETS.md) for details.

**Quick Setup:**
```bash
cd workers

# Check status
bun run secrets:status

# Generate and store secrets
bun run secrets:generate JWT_SECRET
bun run secrets:put JWT_SECRET "<generated-value>"
bun run secrets:put AUTH_SECRET "<generated-value>"
```

### Environment Variables for Pages
Set only non-secret variables in Cloudflare Pages dashboard:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev |

**Note:** `NEXTAUTH_SECRET` is no longer needed in Pages - it's managed by the Worker API.

## 🔗 Service URLs

| Service | URL |
|---------|-----|
| **Frontend (Primary)** | https://1319.tryambakam.space |
| **Frontend (Current)** | https://f94979b8.somatic-canticles.pages.dev |
| **API** | https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev |
| **Health Check** | https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev/health |

**Note:** Custom domain requires setup. See [CUSTOM_DOMAIN_SETUP.md](./CUSTOM_DOMAIN_SETUP.md)

## 🧪 Testing the Deployment

### Test API Health
```bash
curl https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev/health
```

### Test Frontend
Open https://1319.tryambakam.space (or https://f94979b8.somatic-canticles.pages.dev) in your browser

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
