# Tooling & Services

Canonical tooling and external services for Somatic-Canticles Webapp. Use these unless an ADR or explicit approval overrides them.

## Internationalization (i18n)

| Tool | Purpose |
|------|---------|
| **next-intl** | Locale management, message formatting, pluralization |

**Requires:** Next.js. Configure in `next.config.js` and wrap app with `NextIntlClientProvider`. Message files live in `messages/{locale}.json`. See [next-intl docs](https://next-intl-docs.vercel.app/).

## User Analytics

| Tool | Purpose |
|------|---------|
| **Google Analytics (GA4)** | Page views, events, user journeys, conversion tracking |

**Implementation:** Use `@next/third-parties/google` or `react-ga4` for Next.js. Respect `Do Not Track` and cookie consent; gate script loading on consent when required. Add GA Measurement ID to `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var.

## Authentication

| Tool | Purpose |
|------|---------|
| **NextAuth.js** | Session management, OAuth providers, credential auth, JWT strategy |

**Requires:** Next.js. Use for frontend session handling. See `.context/auth/overview.md` and `.context/decisions/004-nextauth-integration.md` for how NextAuth relates to the existing JWT/API auth model.

## Error Tracking

| Tool | Purpose |
|------|---------|
| **Sentry** | Client- and server-side error capture, performance monitoring, release tracking |

**Implementation:** Use `@sentry/nextjs` for Next.js. Configure `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` for Cloudflare/edge. Add `SENTRY_DSN` and `SENTRY_AUTH_TOKEN` (for releases) to env. Filter PII; set `environment` for staging vs production.

## Server Runtime

| Tool | Purpose |
|------|---------|
| **Bun** | Package install, scripts, local dev, test runner |

Already canonical. Use `bun run`, `bun install`, `bun test`. Cloudflare Workers runtime is separate (edge); Bun is for local tooling and build.

## Package Manager

| Tool | Purpose |
|------|---------|
| **Bun** | Install, lockfile, script execution |

Lockfile: `bun.lockb`. CI and local commands assume Bun. No npm/pnpm as primary.

## CI/CD

| Platform | Purpose |
|----------|---------|
| **GitHub Actions** | Test, build, lint, deploy to Cloudflare |

Workflows live in `.github/workflows/`. Typical: test on PR, deploy to Cloudflare Pages/Workers on push to `main` or `develop`.

## Deployment

| Platform | Role |
|----------|------|
| **Cloudflare Pages** | Frontend app (Next.js static/SSR), docs site |
| **Cloudflare Workers** | API, edge logic, serverless functions |

**Clarification:** Pages hosts the web app and static assets; Workers run API routes and edge logic. Not redundant—complementary.

## Documentation

| Tool | Purpose |
|------|---------|
| **Astro** | Documentation site (separate from main app) |

**Scope:** Astro is for a *docs site* (e.g. `/docs` or `docs.somatic-canticles.com`), not the main Somatic Canticles app. Keep docs in an `apps/docs` or `docs/` Astro project. Content in `src/pages/` or MDX.

## Icon Set

| Tool | Purpose |
|------|---------|
| **Lucide** | Icons across the app |

Use `lucide-react`. Consistent size scale: 13, 19, 21px per `.context/ui/component-ecosystem.md`. One icon set only—no mixing with Heroicons, Feather, etc.

---

## Environment Variables Summary

| Var | Service | Required |
|-----|---------|----------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics | Optional |
| `SENTRY_DSN` | Sentry | Yes (prod) |
| `SENTRY_AUTH_TOKEN` | Sentry releases | Yes (CI) |
| `NEXTAUTH_SECRET` | NextAuth | Yes |
| `NEXTAUTH_URL` | NextAuth | Yes |

See `.context/env.md` for full list.
