# Auth Quick Reference

## For Developers

### Creating Protected API Endpoints (Workers)

```typescript
import { requireAuth } from '../middleware/authenticate';

// Wrap your handler with requireAuth
export const handleMyEndpoint = requireAuth(async (request, user) => {
  // user contains: userId, email, birthdate, timezone
  
  return new Response(JSON.stringify({
    message: `Hello ${user.email}!`
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Using Session in Frontend Components

**Client Components:**
```tsx
"use client";
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  
  return <div>Welcome {session.user.email}</div>;
}
```

**Server Components:**
```tsx
import { getSession } from "@/lib/auth/session";

export default async function MyPage() {
  const session = await getSession();
  
  if (!session) redirect("/auth/signin");
  
  return <div>Welcome {session.user.email}</div>;
}
```

### Making Authenticated API Calls

```tsx
import { useSession } from "next-auth/react";

const { data: session } = useSession();

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/endpoint`, {
  headers: {
    "Authorization": `Bearer ${session?.user?.apiToken}`,
    "Content-Type": "application/json",
  },
});
```

## Quick Commands

### Generate Secrets
```bash
openssl rand -base64 32
```

### Test Registration
```bash
curl -X POST http://localhost:8787/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","birthdate":"1990-01-01","timezone":"America/New_York"}'
```

### Test Login
```bash
curl -X POST http://localhost:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

## Configuration

### Required Environment Variables
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl>
JWT_SECRET=<generate-with-openssl>
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### Optional OAuth
```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Troubleshooting

**"Invalid credentials"** → Check password meets requirements (8+ chars, mixed case, number)  
**"Rate limit exceeded"** → Wait 15 minutes or restart Workers server  
**"Token verification failed"** → Check JWT_SECRET matches between requests  
**"NEXTAUTH_SECRET not set"** → Generate and add to .env.local  

## Security Notes

- ✅ Passwords hashed with Argon2id (64MB, 3 iterations)
- ✅ JWT tokens expire after 30 days
- ✅ Rate limiting: 5 login attempts per 15 min
- ✅ Input validation on all fields
- ✅ Protected routes redirect to signin
- ✅ CORS configured for localhost + production

## File Locations

**Frontend Auth**: `src/lib/auth/`, `src/components/auth/`  
**Backend Auth**: `workers/api/auth/`, `workers/lib/`  
**Protected Routes**: `src/middleware.ts`  
**API Router**: `workers/api/index.ts`
