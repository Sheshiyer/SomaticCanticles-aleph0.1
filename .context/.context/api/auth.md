# API Contract: Authentication

**Status:** Contract-First Design (Backend implements, Frontend builds against)  
**Version:** 1.0.0  
**Last Updated:** 2026-02-09

---

## Overview

This document defines the authentication API contract between frontend (Next.js + NextAuth) and backend (Cloudflare Workers).

**Integration Pattern:**
1. Frontend uses NextAuth.js for session management
2. Backend validates JWT tokens issued by Workers
3. Both use same JWT secret for token verification

---

## Default Development Credentials

For local development and testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@somatic-canticles.local` | `SomaticDev44!` |
| User | `test@example.com` | `TestUser13!` |

**Note:** These are seeded automatically via `.context/database/seed-dev.sql`

---

## Endpoints

### POST /auth/login

Authenticate user and receive JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "user-001",
    "email": "user@example.com",
    "role": "user",
    "birthdate": "1990-01-01",
    "timezone": "America/New_York"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials
- `429 Too Many Requests` - Rate limit exceeded

---

### POST /auth/refresh

Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

**Errors:**
- `401 Unauthorized` - Invalid refresh token

---

### POST /auth/logout

Invalidate refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### POST /auth/register

Register new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass13!",
  "birthdate": "1990-07-22",
  "timezone": "America/Los_Angeles"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "user-new-001",
    "email": "newuser@example.com",
    "role": "user",
    "birthdate": "1990-07-22",
    "timezone": "America/Los_Angeles",
    "created_at": "2026-02-09T10:00:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Validation error (email exists, weak password)
- `422 Unprocessable Entity` - Invalid birthdate or timezone

---

## Authentication Header

All protected endpoints require JWT in Authorization header:

```
Authorization: Bearer <access_token>
```

---

## JWT Token Structure

### Access Token

```json
{
  "sub": "user-001",
  "email": "user@example.com",
  "role": "user",
  "iat": 1707475200,
  "exp": 1707476100,
  "type": "access"
}
```

**Claims:**
- `sub` - User ID
- `email` - User email
- `role` - User role (user, admin)
- `iat` - Issued at (Unix timestamp)
- `exp` - Expiration (Unix timestamp)
- `type` - Token type (access)

**Expiry:** 15 minutes (900 seconds)

### Refresh Token

```json
{
  "sub": "user-001",
  "jti": "refresh-token-id-001",
  "iat": 1707475200,
  "exp": 1708080000,
  "type": "refresh"
}
```

**Expiry:** 7 days (604800 seconds)

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Email or password incorrect |
| `AUTH_TOKEN_EXPIRED` | 401 | JWT token has expired |
| `AUTH_TOKEN_INVALID` | 401 | JWT token signature invalid |
| `AUTH_REFRESH_INVALID` | 401 | Refresh token invalid or revoked |
| `AUTH_RATE_LIMITED` | 429 | Too many login attempts |
| `AUTH_EMAIL_EXISTS` | 400 | Email already registered |
| `AUTH_WEAK_PASSWORD` | 400 | Password doesn't meet requirements |
| `AUTH_INVALID_BIRTHDATE` | 422 | Birthdate format invalid |
| `AUTH_INVALID_TIMEZONE` | 422 | Timezone not recognized |

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 requests | 1 minute per IP |
| POST /auth/register | 3 requests | 5 minutes per IP |
| POST /auth/refresh | 10 requests | 1 minute per IP |

---

## Security Requirements

### Password Policy
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### Password Hashing
- Algorithm: Argon2id
- Memory cost: 65536 KiB
- Time cost: 3 iterations
- Parallelism: 4 threads

### Token Security
- Access tokens: Short-lived (15 min)
- Refresh tokens: Stored hashed in database
- Tokens transmitted over HTTPS only
- Refresh tokens rotated on use

---

## Frontend Integration

### NextAuth.js Configuration

```typescript
// src/lib/auth/config.ts
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Call Workers /auth/login
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        
        if (!res.ok) return null;
        
        const data = await res.json();
        return {
          id: data.user.id,
          email: data.user.email,
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      
      // Refresh token if expired
      if (token.exp && Date.now() > token.exp * 1000) {
        const refreshed = await refreshAccessToken(token.refreshToken);
        token.accessToken = refreshed.access_token;
        token.refreshToken = refreshed.refresh_token;
        token.exp = refreshed.expires_in + Math.floor(Date.now() / 1000);
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    }
  }
};
```

### API Client with Auth

```typescript
// src/lib/api/client.ts
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.accessToken}`,
      ...options.headers
    }
  });
  
  if (res.status === 401) {
    // Token expired, trigger refresh
    await signIn('credentials', { redirect: false });
    throw new Error('Session expired');
  }
  
  return res;
}
```

---

## Backend Implementation Notes

### Workers Middleware

```typescript
// workers/api/middleware/auth.ts
export async function authMiddleware(request: Request, env: Env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Missing token' }, { status: 401 });
  }
  
  const token = authHeader.slice(7);
  
  try {
    const payload = await jwtVerify(token, env.JWT_SECRET);
    
    if (payload.type !== 'access') {
      return json({ error: 'Invalid token type' }, { status: 401 });
    }
    
    // Attach user to request context
    request.user = payload;
    return null; // Continue to handler
  } catch (e) {
    return json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-09 | Initial contract with JWT auth |

---

**Related:**
- [Overview](../auth/overview.md) - Auth architecture
- [Security](../auth/security.md) - Security practices
- [Errors](../errors.md) - Error handling patterns
