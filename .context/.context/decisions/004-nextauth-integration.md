# ADR-004: NextAuth.js Integration Alongside JWT API

## Status
Accepted

## Context

The project has two auth-related decisions:

1. **ADR-001** documents a custom JWT + refresh-token flow for the **API layer** (backend/Workers).
2. The user wants **NextAuth.js** for the **frontend** (Next.js app on Cloudflare Pages).

These serve different layers and can coexist.

## Decision

Use **NextAuth.js** for the Next.js frontend session management, with a **JWT strategy** that aligns with the existing API JWT flow where applicable.

- **NextAuth** handles: OAuth (Google, GitHub, etc.), credential login UI, session cookies, `useSession()`, `getServerSession()`.
- **API/Workers** continue to use JWT Bearer tokens; NextAuth can be configured to issue JWTs that the API accepts.

### Integration Options

1. **Credentials provider + custom API**: NextAuth credentials provider calls our existing `/auth/login` API; session stores user + access token for API calls.
2. **NextAuth JWT strategy**: Configure NextAuth to use JWT for the session; optionally sign JWTs in a format the API can validate.
3. **OAuth + API**: OAuth for social login; after OAuth callback, call our API to create/link user and get API token.

Choose based on whether social login is required; credentials-only is simplest.

## Consequences

### Positive
- NextAuth provides battle-tested OAuth and session handling.
- Frontend gets `useSession`, `getServerSession`, protected routes.
- Can keep existing JWT API; no need to rewrite backend auth.

### Negative
- Two auth systems to document and maintain (NextAuth + API JWT).
- Must ensure session/JWT format is consistent for API calls.

### Neutral
- ADR-001 remains valid for the API/Workers layer.
- NextAuth replaces only the *frontend* session layer, not the API auth contract.

## Implementation Notes

- Configure NextAuth with JWT strategy if API expects Bearer tokens.
- Store API access token in NextAuth session/callback when using credentials provider.
- Use `getToken()` in API route handlers or server components to pass token to Workers/API.
- See `.context/auth/overview.md` for API JWT expectations; `.context/auth/integration.md` for middleware patterns.
