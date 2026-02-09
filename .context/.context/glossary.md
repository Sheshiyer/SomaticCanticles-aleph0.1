# Project Glossary

This file defines project-specific terminology. AI should use these terms consistently and understand their specific meaning in this codebase.

## Domain Terms

| Term | Definition | Usage |
|------|------------|-------|
| **Substrate** | The structured documentation system in `.context/` | "Update the substrate when adding new patterns" |
| **Domain** | A logical grouping of related functionality (auth, api, database) | "The auth domain handles all authentication" |
| **Context** | Documentation that provides AI with project understanding | "Include relevant context before generating code" |

## Technical Terms

| Term | Definition | Not to be confused with |
|------|------------|------------------------|
| **Handler** | HTTP request handler (controller layer) | Service (business logic layer) |
| **Service** | Business logic layer component | Handler or Repository |
| **Repository** | Data access layer abstraction | ORM model or direct database access |
| **Model** | Data structure representing domain entity | Database table (which is "schema") |
| **DTO** | Data Transfer Object for API boundaries | Domain Model (internal representation) |
| **Entity** | Domain object with identity and lifecycle | Value Object (identity-less) |

### Naming Conventions

| Layer | Type Suffix | Variable Suffix | Example |
|-------|-------------|-----------------|---------|
| HTTP/API | `Handler` | `handler` | `UserHandler`, `userHandler` |
| Business Logic | `Service` | `service` | `AuthService`, `authService` |
| Data Access | `Repository` | `repo` | `UserRepository`, `userRepo` |

**Handler** receives HTTP requests, validates input, calls Service, formats response.
**Service** contains business logic, orchestrates operations, enforces rules.
**Repository** abstracts database operations, returns domain models.

## Somatic-Canticles Terms

| Term | Definition |
|------|------------|
| **biorhythm** | Cyclical state (physical, emotional, intellectual, spiritual) used to gate chapter and content unlocks |
| **canticle** | Extended audio piece tied to a chapter (e.g. Morning Octave, 44-Sequence) |
| **unlock** (chapter unlock) | Moment when a chapter or feature becomes available, often triggered by biorhythm state and/or streak |
| **WitnessOS** | Framework and cosmology underlying the Somatic-Canticles universe and practices |
| **power number** | Numeric motif (8, 13, 19, 21, 44, 125, 152) used in UI, timing, and structure |
| **streak** | Consecutive days (daily streak) or aligned cycles (biorhythm streak) for continuity and rewards |
| **cycle** | One of four dimensions: physical, emotional, intellectual, spiritual |

## Project-Specific Terms

| Term | Meaning in this project |
|------|------------------------|
| **User** | Authenticated account holder |
| **Profile** | Extended user information (bio, avatar, preferences) |
| **Session** | Active authentication context (JWT + refresh token pair) |
| **Permission** | Granular access right (e.g., `user:read`) |
| **Role** | Named collection of permissions (e.g., `admin`) |

## Abbreviations

| Abbreviation | Full Form | Context |
|--------------|-----------|---------|
| **DI** | Dependency Injection | Architecture patterns |
| **DTO** | Data Transfer Object | API layer |
| **JWT** | JSON Web Token | Authentication |
| **RBAC** | Role-Based Access Control | Authorization |
| **ORM** | Object-Relational Mapping | Database access |
| **ADR** | Architecture Decision Record | Documentation |

## Status Values

| Status | Meaning | Valid transitions |
|--------|---------|-------------------|
| `active` | Normal operational state | → `inactive`, `suspended` |
| `inactive` | User-initiated deactivation | → `active` |
| `suspended` | Admin-initiated restriction | → `active` |
| `deleted` | Soft-deleted, not recoverable by user | (terminal) |

## Error Code Prefixes

| Prefix | Domain | Example |
|--------|--------|---------|
| `AUTH_` | Authentication errors | `AUTH_INVALID_TOKEN` |
| `USER_` | User management errors | `USER_NOT_FOUND` |
| `VAL_` | Validation errors | `VAL_INVALID_FORMAT` |
| `RES_` | Resource errors | `RES_NOT_FOUND` |
| `RATE_` | Rate limiting errors | `RATE_LIMIT_EXCEEDED` |
| `SYS_` | System/internal errors | `SYS_INTERNAL_ERROR` |

See [errors.md](./errors.md) for the complete error codes catalog.

---

**Usage**: When generating code or documentation, use these exact terms. Do not invent synonyms or alternative phrasings for defined concepts.
