# Secrets Management Guide

This guide explains how to manage secrets for the Somatic-Canticles Workers API using the centralized secrets management system.

## Overview

We use a multi-layered approach for secret management:

1. **Worker Secrets** (Primary) - Encrypted at rest, set via `wrangler secret put`
2. **KV Namespace** (Fallback) - For dynamic/rotated secrets with versioning
3. **In-Memory Cache** - Performance optimization (5-min TTL)

## Quick Start

### 1. Check Secret Status

```bash
cd workers
bun run secrets:status
```

### 2. Generate a New Secret

```bash
# Generate a secure 32-byte secret
bun run secrets:generate JWT_SECRET

# Output: Base64-encoded random string
```

### 3. Store a Secret

**Option A: Worker Secrets (Recommended for static secrets)**
```bash
bun run secrets:put JWT_SECRET "your-secret-value"
```

**Option B: KV Storage (For dynamic/rotated secrets)**
```bash
bun run secrets:put-kv JWT_SECRET "your-secret-value"
```

## Available Secrets

| Name | Required | Description |
|------|----------|-------------|
| `JWT_SECRET` | ✓ Yes | JWT signing key for access/refresh tokens |
| `AUTH_SECRET` | ✓ Yes | Authentication encryption key |
| `SENTRY_DSN` | ○ No | Error tracking DSN |
| `GOOGLE_CLIENT_ID` | ○ No | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ○ No | Google OAuth Client Secret |

## Secret Rotation

### Zero-Downtime Rotation

1. **Generate and store new version in KV:**
   ```bash
   bun run secrets:rotate JWT_SECRET
   ```

2. **Wait for cache expiration (max 5 minutes)**
   - The app automatically picks up the new version
   - Existing tokens remain valid during transition

3. **Update Worker Secret for permanence:**
   ```bash
   bun run secrets:put JWT_SECRET "<new-value>"
   ```

### Manual KV Rotation

```bash
# Store new version with timestamp
wrangler kv:key put "secret:JWT_SECRET:v$(date +%s)" "new-value" --binding SECRETS_KV

# Update pointer to latest
wrangler kv:key put "secret:JWT_SECRET:latest" "secret:JWT_SECRET:v$(date +%s)" --binding SECRETS_KV
```

## Architecture

### Secret Resolution Flow

```
Request comes in
       │
       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  1. Check        │───▶│  2. Check        │───▶│  3. Check KV     │
│  Worker Secrets  │    │  Local Cache     │    │  (if enabled)    │
│  (env.SECRET)    │    │  (5 min TTL)     │    │  (with versioning│
└──────────────────┘    └──────────────────┘    └──────────────────┘
       │                       │                       │
       ▼                       ▼                       ▼
  Encrypted at rest      In-memory only          Versioned keys
  Most secure            Fastest                 Dynamic rotation
```

### Security Considerations

- **Worker Secrets** are encrypted at rest and only decrypted at runtime
- **KV values** are encrypted at rest by Cloudflare
- **Cache** is in-memory only and never persisted
- Secrets are never logged or exposed in error messages

## Environment Setup

### Development

```bash
# Create KV namespace for dev
wrangler kv:namespace create "SECRETS_KV"

# Update wrangler.toml with the KV ID
# Then set secrets
bun run secrets:put JWT_SECRET "dev-jwt-secret"
bun run secrets:put AUTH_SECRET "dev-auth-secret"
```

### Production

```bash
# Create KV namespace for production
wrangler kv:namespace create "SECRETS_KV" --env production

# Update wrangler.toml production section with the KV ID
# Then set secrets
CF_ENV=production bun run secrets:put JWT_SECRET "prod-jwt-secret"
CF_ENV=production bun run secrets:put AUTH_SECRET "prod-auth-secret"
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `bun run secrets:list` | List all configured secrets |
| `bun run secrets:status` | Check which secrets are set |
| `bun run secrets:generate [name]` | Generate a secure random secret |
| `bun run secrets:put <name> <value>` | Store in Worker Secrets |
| `bun run secrets:put-kv <name> <value>` | Store in KV |
| `bun run secrets:rotate <name>` | Rotate with versioning |

## Troubleshooting

### Secret Not Found

```bash
# Check if secret is set
bun run secrets:status

# Verify KV binding is correct in wrangler.toml
wrangler kv:namespace list
```

### Cache Issues

The cache automatically expires after 5 minutes. To force a refresh:

```typescript
// In your worker, access the secrets manager
const secrets = c.get('secrets');
secrets.clearCache();
```

### Migration from Environment Variables

If you're migrating from `.env` files:

1. Copy values from `.env.local`:
   ```bash
   source .env.local && bun run secrets:put JWT_SECRET "$JWT_SECRET"
   ```

2. Remove from `.env.local` (keep only non-secret vars)

3. Verify all secrets are set:
   ```bash
   bun run secrets:status
   ```

## API Usage

Access secrets in your routes:

```typescript
import type { Context } from 'hono';
import type { Env, Variables } from '../index';

export async function myHandler(c: Context<{ Bindings: Env; Variables: Variables }>) {
  // Get secrets manager from context
  const secrets = c.get('secrets');
  
  // Get a secret
  const jwtSecret = await secrets.get('JWT_SECRET');
  
  // Get with error if missing
  const requiredSecret = await secrets.getRequired('JWT_SECRET');
  
  // Check if exists
  const hasSentry = await secrets.has('SENTRY_DSN');
}
```

## Best Practices

1. **Use Worker Secrets** for static secrets (JWT keys, API keys)
2. **Use KV** for secrets that need rotation or versioning
3. **Rotate regularly** - Set a calendar reminder for quarterly rotation
4. **Never commit secrets** - Use the secrets manager, not `.env` files
5. **Use different secrets** per environment (dev/staging/prod)
6. **Monitor access** - Check Cloudflare logs for unusual patterns

## Emergency Procedures

### Compromised Secret

1. **Immediately rotate** the compromised secret:
   ```bash
   bun run secrets:rotate JWT_SECRET
   ```

2. **Force cache clear** by deploying a new worker version

3. **Audit** recent access logs in Cloudflare Dashboard

4. **Notify users** if tokens need revalidation

### Lost Secret Recovery

If you lose access to a secret:

1. Generate a new one: `bun run secrets:generate`
2. Store it: `bun run secrets:put NAME value`
3. Update any external systems that use it
4. If JWT_SECRET changed, users will need to re-login
