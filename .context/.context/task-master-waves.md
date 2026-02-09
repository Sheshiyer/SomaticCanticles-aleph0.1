# Task Master Waves: Frontend-Backend Interwoven Plan

**Generated:** 2026-02-09  
**Total Tasks:** 80 tasks (condensed from 201 for focused delivery)  
**Waves:** 2 interwoven waves (not silos)  
**Default Admin:** See `.context/env.md` for development credentials

---

## Architecture: Interwoven Waves (Not Silos)

```
WAVE 1: FOUNDATION (Weeks 1-3)
├── Sprint 1.1: Project Bootstrap (Mixed)
├── Sprint 1.2: Core Infrastructure (Backend-heavy)
└── Sprint 1.3: UI Foundation (Frontend-heavy)
    ↓ (Backend APIs ready, Frontend components ready)
WAVE 2: FEATURES (Weeks 4-8)
├── Sprint 2.1: Auth & User (Interwoven)
├── Sprint 2.2: Biorhythm Engine (Backend → Frontend)
├── Sprint 2.3: Chapter System (Interwoven)
├── Sprint 2.4: Unlock Experience (Frontend-heavy)
└── Sprint 2.5: Polish & Launch (Mixed)
```

**Interweaving Pattern:**
- Backend creates API contracts first (documented in `.context/api/`)
- Frontend builds against mocks/stubs using contracts
- Parallel implementation with daily sync points
- Integration happens continuously, not at the end

---

## WAVE 1: FOUNDATION

### Sprint 1.1: Project Bootstrap (Week 1, Days 1-3)
**Focus:** Infrastructure setup, tooling, documentation
**Pattern:** Mixed - both frontend and backend setup in parallel

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W1-S1-01 | Initialize Next.js 14 project with TypeScript + Bun | Frontend | Frontend Eng | 2h | - | Next.js project at repo root | `bun run dev` works on localhost:3000 |
| W1-S1-02 | Configure Tailwind with warcraftcn-ui foundation | Frontend | Frontend Eng | 2h | W1-S1-01 | tailwind.config.ts with warcraftcn-ui | Power-number colors work with warcraftcn-ui |
| W1-S1-03 | Set up Cloudflare Workers project structure | Backend | Backend Eng | 2h | - | workers/ directory with wrangler.toml | `wrangler dev` runs with /health endpoint |
| W1-S1-04 | Configure D1 database with schema | Backend | Backend Eng | 2h | W1-S1-03 | D1 database with migrations | `wrangler d1 migrations apply` succeeds |
| W1-S1-05 | Create .env.example with all required variables | Backend | DevOps | 1h | W1-S1-03 | .env.example with 40+ variables | All env vars documented with descriptions |
| W1-S1-06 | Set up CI/CD pipeline (GitHub Actions) | Backend | DevOps | 2h | W1-S1-01, W1-S1-03 | .github/workflows/ci-cd.yml | Pipeline runs on push with lint/build/test |
| W1-S1-07 | Configure Sentry error tracking | Backend | Backend Eng | 1h | W1-S1-01 | Sentry config for client/server/edge | Errors captured in Sentry dashboard |
| W1-S1-08 | Configure Google Analytics (GA4) | Frontend | Frontend Eng | 1h | W1-S1-01 | Analytics component integrated | GA4 loads in production only |
| W1-S1-09 | Create comprehensive README with admin credentials | Backend | Tech Lead | 2h | W1-S1-05 | README.md with setup instructions | New dev can onboard in < 30 minutes |
| W1-S1-10 | Set up Cloudflare Pages deployment config | Backend | DevOps | 2h | W1-S1-06 | .pages.yml with production/preview envs | Deploys to Cloudflare Pages on main push |

**Sprint 1.1 Deliverable:** Working development environment with deployment pipeline

---

### Sprint 1.2: Core Infrastructure (Week 1-2, Days 4-10)
**Focus:** Database, Auth foundation, API structure
**Pattern:** Backend-heavy with frontend stubs

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W1-S2-01 | Design database schema (users, chapters, progress) | Backend | Backend Eng | 3h | W1-S1-04 | Schema documented in `.context/database/schema.md` | Schema covers all 12 chapters + user data |
| W1-S2-02 | Create D1 migration scripts | Backend | Backend Eng | 2h | W1-S2-01 | migrations/0001_initial_schema.sql | Migrations run successfully locally |
| W1-S2-03 | Set up database client (Drizzle ORM) | Backend | Backend Eng | 2h | W1-S2-02 | src/lib/db/ with Drizzle config | Can query database from Workers |
| W1-S2-04 | Create seed script with test data | Backend | Backend Eng | 2h | W1-S2-02 | scripts/seed.ts with test users/chapters | `bun run seed` populates test data |
| W1-S2-05 | Design auth API contract | Backend | Backend Eng | 2h | - | `.context/api/auth.md` with endpoints | API spec reviewed by frontend team |
| W1-S2-06 | Implement JWT auth middleware | Backend | Backend Eng | 3h | W1-S2-05 | workers/api/auth/middleware.ts | Middleware validates JWT tokens |
| W1-S2-07 | Build /auth/login endpoint | Backend | Backend Eng | 3h | W1-S2-06 | POST /auth/login returns JWT | Returns valid JWT for correct credentials |
| W1-S2-08 | Build /auth/refresh endpoint | Backend | Backend Eng | 2h | W1-S2-07 | POST /auth/refresh extends session | Returns new JWT for valid refresh token |
| W1-S2-09 | Implement password hashing (Argon2id) | Backend | Backend Eng | 2h | W1-S2-07 | Password hashing in auth service | Passwords never stored plaintext |
| W1-S2-10 | Add rate limiting for auth endpoints | Backend | Backend Eng | 2h | W1-S2-07 | Rate limiting middleware | 5 attempts per minute per IP |
| W1-S2-11 | Document auth errors and codes | Backend | Backend Eng | 1h | W1-S2-07 | `.context/errors.md` auth section | All auth errors have documented codes |
| W1-S2-12 | Create frontend auth service stub | Frontend | Frontend Eng | 2h | W1-S2-05 | src/lib/auth/api.ts with mocked calls | Frontend can import auth service |

**Sprint 1.2 Deliverable:** Auth system backend ready, frontend stubbed for integration

---

### Sprint 1.3: UI Foundation (Week 2, Days 8-14)
**Focus:** warcraftcn-ui integration, design system, core components
**Pattern:** Frontend-heavy with backend contract awareness

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W1-S3-01 | Clone and analyze warcraftcn-ui | Frontend | Frontend Eng | 2h | W1-S1-02 | Local copy analyzed, component inventory | Documented list of usable components |
| W1-S3-02 | Extract core UI components (Button, Card, Modal) | Frontend | Frontend Eng | 3h | W1-S3-01 | src/components/ui/ with base components | Components render with warcraftcn-ui styling |
| W1-S3-03 | Adapt warcraftcn-ui colors to power-number palette | Frontend | Frontend Eng | 3h | W1-S3-02 | Merged color system in Tailwind | Can use bg-octave, text-solar classes |
| W1-S3-04 | Integrate light-pillar effects | Frontend | Frontend Eng | 3h | W1-S3-02 | LightPillar component in src/components/effects/ | Customizable color and intensity props |
| W1-S3-05 | Build navigation components | Frontend | Frontend Eng | 3h | W1-S3-02 | Header, Sidebar, MobileNav components | Navigation works responsively |
| W1-S3-06 | Create auth page layouts | Frontend | Frontend Eng | 4h | W1-S3-02, W1-S2-05 | Login, Signup page layouts | Pages styled with warcraftcn-ui |
| W1-S3-07 | Implement dark/light mode | Frontend | Frontend Eng | 2h | W1-S3-03 | Theme toggle with system preference | Mode persists across sessions |
| W1-S3-08 | Build form components with validation | Frontend | Frontend Eng | 3h | W1-S3-02 | Input, Select, Textarea with React Hook Form | Forms validate and submit correctly |
| W1-S3-09 | Create loading and error states | Frontend | Frontend Eng | 2h | W1-S3-02 | Spinner, ErrorBoundary components | Graceful handling of loading/errors |
| W1-S3-10 | Document UI component usage | Frontend | Tech Lead | 2h | W1-S3-02 | Component docs in `.context/ui/patterns.md` | Team can reference usage examples |

**Sprint 1.3 Deliverable:** Complete UI component library with warcraftcn-ui foundation

---

## WAVE 2: FEATURES

### Sprint 2.1: Auth & User Integration (Week 3, Days 15-21)
**Focus:** Connect frontend auth to backend, user dashboard
**Pattern:** Interwoven - frontend and backend tasks interdependent

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W2-S1-01 | Set up NextAuth.js with credentials provider | Frontend | Frontend Eng | 4h | W1-S2-07, W1-S3-06 | NextAuth config with login/logout | Can log in with email/password |
| W2-S1-02 | Connect NextAuth to Workers JWT | Frontend | Frontend Eng | 3h | W2-S1-01, W1-S2-07 | JWT strategy aligned with Workers | Tokens work across frontend/backend |
| W2-S1-03 | Create protected route middleware | Frontend | Frontend Eng | 2h | W2-S1-01 | Middleware checks auth on protected routes | Redirects to login when unauthenticated |
| W2-S1-04 | Build user registration flow | Frontend | Frontend Eng | 3h | W2-S1-01 | Signup form with validation | Can create account with birth data |
| W2-S1-05 | Build /user/profile GET endpoint | Backend | Backend Eng | 2h | W1-S2-06 | GET /user/profile returns user data | Returns current user profile |
| W2-S1-06 | Build /user/profile PUT endpoint | Backend | Backend Eng | 2h | W2-S1-05 | PUT /user/profile updates user | Updates user data with validation |
| W2-S1-07 | Create user dashboard layout | Frontend | Frontend Eng | 4h | W1-S3-05, W2-S1-03 | Dashboard shell with navigation | Dashboard renders for authenticated users |
| W2-S1-08 | Build user settings page | Frontend | Frontend Eng | 3h | W2-S1-07, W2-S1-06 | Settings form with update functionality | Can update profile and password |
| W2-S1-09 | Add Google OAuth provider | Mixed | Full Stack Eng | 3h | W2-S1-01 | Google OAuth login works | Can log in with Google account |
| W2-S1-10 | Implement session persistence | Frontend | Frontend Eng | 2h | W2-S1-01 | Sessions persist across page reloads | User stays logged in on refresh |

**Sprint 2.1 Deliverable:** Complete auth flow working end-to-end

---

### Sprint 2.2: Biorhythm Engine (Week 4, Days 22-28)
**Focus:** Backend calculation engine, frontend visualization
**Pattern:** Backend → Frontend (backend first, then frontend)

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W2-S2-01 | Research biorhythm calculation algorithms | Backend | Backend Eng | 4h | - | Documented algorithm in `.context/` | Algorithm validated with references |
| W2-S2-02 | Build core biorhythm calculator | Backend | Backend Eng | 6h | W2-S2-01 | src/lib/biorhythm/calculator.ts | Calculates 4 cycles (P/E/I/S) correctly |
| W2-S2-03 | Build /biorhythm/calculate endpoint | Backend | Backend Eng | 3h | W2-S2-02, W2-S1-05 | POST /biorhythm/calculate | Returns cycle values for birth date |
| W2-S2-04 | Build /biorhythm/predict endpoint (30-day) | Backend | Backend Eng | 3h | W2-S2-03 | GET /biorhythm/predict | Returns 30-day forecast |
| W2-S2-05 | Implement sunrise/sunset calculation | Backend | Backend Eng | 3h | W2-S2-03 | Sunrise API integration | Returns accurate sunrise for location/date |
| W2-S2-06 | Write biorhythm unit tests | Backend | Backend Eng | 4h | W2-S2-02 | Tests with 100% coverage | All tests pass, validated against known calculators |
| W2-S2-07 | Document biorhythm API contract | Backend | Backend Eng | 2h | W2-S2-03 | `.context/api/biorhythm.md` | Frontend team can build against spec |
| W2-S2-08 | Create biorhythm service on frontend | Frontend | Frontend Eng | 3h | W2-S2-07 | src/lib/biorhythm/api.ts | Service calls backend endpoints |
| W2-S2-09 | Build biorhythm wheel visualization | Frontend | Frontend Eng | 6h | W1-S3-04, W2-S2-08 | SVG cycle wheel component | Wheel shows 4 cycles with positions |
| W2-S2-10 | Build cycle percentage bars | Frontend | Frontend Eng | 3h | W2-S2-08 | Progress bars for each cycle | Bars update with live data |
| W2-S2-11 | Build 30-day forecast chart | Frontend | Frontend Eng | 4h | W2-S2-08 | Line chart showing 30-day prediction | Chart renders forecast data |
| W2-S2-12 | Add biorhythm to dashboard | Frontend | Frontend Eng | 3h | W2-S1-07, W2-S2-09 | Dashboard shows today's biorhythm | Dashboard displays current cycle values |

**Sprint 2.2 Deliverable:** Biorhythm calculation and visualization working end-to-end

---

### Sprint 2.3: Chapter System (Week 5, Days 29-35)
**Focus:** Chapter data, unlock logic, content display
**Pattern:** Interwoven - schema, API, and UI built together

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W2-S3-01 | Create chapter data schema extension | Backend | Backend Eng | 2h | W1-S2-02 | Migration for chapter content tables | Schema supports 12 chapters with metadata |
| W2-S3-02 | Seed database with 12 chapter definitions | Backend | Backend Eng | 2h | W2-S3-01 | Seed script with chapter data | All 12 chapters in database |
| W2-S3-03 | Build /chapters/list endpoint | Backend | Backend Eng | 2h | W2-S3-02 | GET /chapters/list | Returns all chapters with unlock status |
| W2-S3-04 | Build /chapters/:id endpoint | Backend | Backend Eng | 2h | W2-S3-02 | GET /chapters/:id | Returns chapter detail with content |
| W2-S3-05 | Build /chapters/progress endpoint | Backend | Backend Eng | 3h | W2-S3-02 | GET/POST /chapters/progress | Tracks user progress per chapter |
| W2-S3-06 | Design unlock trigger logic | Backend | Backend Eng | 3h | W2-S2-02 | Document unlock conditions | Each chapter has defined unlock trigger |
| W2-S3-07 | Build unlock evaluation engine | Backend | Backend Eng | 4h | W2-S3-06 | Service checks if chapter should unlock | Correctly identifies unlockable chapters |
| W2-S3-08 | Build /chapters/check-unlock endpoint | Backend | Backend Eng | 3h | W2-S3-07 | POST /chapters/check-unlock | Returns unlockable chapters for user |
| W2-S3-09 | Create chapter card components | Frontend | Frontend Eng | 4h | W1-S3-02, W2-S3-03 | ChapterCard with locked/unlocked states | Cards show correct state per chapter |
| W2-S3-10 | Build chapter grid layout | Frontend | Frontend Eng | 3h | W2-S3-09 | Grid showing all 12 chapters | Responsive grid with chapter cards |
| W2-S3-11 | Build chapter detail page | Frontend | Frontend Eng | 4h | W2-S3-04, W2-S3-09 | Chapter detail with content sections | Shows intro, practice, reflection |
| W2-S3-12 | Create chapter navigation (prev/next) | Frontend | Frontend Eng | 2h | W2-S3-11 | Navigation between chapters | Can move between unlocked chapters |

**Sprint 2.3 Deliverable:** Chapter system with unlock logic working end-to-end

---

### Sprint 2.4: Unlock Experience (Week 6, Days 36-42)
**Focus:** 13-second unlock animation, audio player, immersive experience
**Pattern:** Frontend-heavy with backend unlock API

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W2-S4-01 | Design 13-second unlock animation sequence | Frontend | Designer | 3h | - | Animation storyboard document | Sequence defined: pulse, transform, expand, reveal |
| W2-S4-02 | Build unlock animation with Framer Motion | Frontend | Frontend Eng | 6h | W1-S3-04, W2-S4-01 | UnlockAnimation component | Animation plays 13-second sequence |
| W2-S4-03 | Integrate light pillars into unlock | Frontend | Frontend Eng | 3h | W2-S4-02 | Light pillars synchronized with animation | Pillars pulse and glow during unlock |
| W2-S4-04 | Add 8-beat rhythm pulse effect | Frontend | Frontend Eng | 3h | W2-S4-02 | Rhythmic pulse synced to animation | Pulse matches 8-beat timing |
| W2-S4-05 | Add color transformation (13 colors) | Frontend | Frontend Eng | 3h | W2-S4-02 | Color shifts through 13 colors | Smooth color transitions |
| W2-S4-06 | Add geometric expansion (19-point mandala) | Frontend | Frontend Eng | 3h | W2-S4-02 | Mandala expands during unlock | Geometric pattern renders correctly |
| W2-S4-07 | Build unlock modal with animation | Frontend | Frontend Eng | 3h | W2-S4-02 | Modal triggers on chapter unlock | Modal shows animation then reveals chapter |
| W2-S4-08 | Implement reduced motion variant | Frontend | Frontend Eng | 2h | W2-S4-02 | Accessibility-friendly version | Respects prefers-reduced-motion |
| W2-S4-09 | Set up audio file storage (R2) | Backend | DevOps | 2h | - | R2 bucket for canticle audio | Audio files accessible via CDN |
| W2-S4-10 | Build audio player component | Frontend | Frontend Eng | 6h | W1-S3-02 | Custom audio player | Player has play/pause/scrub/volume |
| W2-S4-11 | Add audio to chapter detail page | Frontend | Frontend Eng | 3h | W2-S3-11, W2-S4-10 | Embedded audio player | Can play canticle from chapter page |
| W2-S4-12 | Optimize animation performance | Frontend | Frontend Eng | 2h | W2-S4-07 | 60fps on mid-range devices | No jank during animation |

**Sprint 2.4 Deliverable:** Immersive unlock experience with audio working

---

### Sprint 2.5: Polish & Launch (Week 7-8, Days 43-56)
**Focus:** Progress tracking, testing, deployment, launch
**Pattern:** Mixed - final integration and polish

| ID | Task | Area | Owner | Hours | Dependencies | Deliverable | Acceptance |
|----|------|------|-------|-------|--------------|-------------|------------|
| W2-S5-01 | Build progress tracking API | Backend | Backend Eng | 3h | W2-S3-05 | Progress endpoints for all activities | Tracks chapter completion, time spent |
| W2-S5-02 | Implement streak tracking logic | Backend | Backend Eng | 4h | W2-S5-01 | Streak calculation service | Correctly calculates 7/13/21/44-day streaks |
| W2-S5-03 | Create achievement system backend | Backend | Backend Eng | 3h | W2-S5-01 | Achievement unlock logic | Achievements trigger on milestones |
| W2-S5-04 | Build progress dashboard UI | Frontend | Frontend Eng | 4h | W2-S1-07, W2-S5-01 | Dashboard shows progress/stats | Users see completion %, streaks |
| W2-S5-05 | Build achievement gallery | Frontend | Frontend Eng | 3h | W2-S5-03 | Achievement badges and gallery | Shows unlocked/locked achievements |
| W2-S5-06 | Write unit tests for critical paths | Mixed | QA Eng | 6h | W2-S2-06 | Test suite for biorhythm, auth, unlock | >80% coverage on critical paths |
| W2-S5-07 | Write E2E tests for user flows | Mixed | QA Eng | 6h | W2-S5-06 | Playwright tests for signup→unlock→play | Tests cover complete user journey |
| W2-S5-08 | Performance optimization | Mixed | Full Stack Eng | 4h | W2-S5-07 | Lighthouse score >90 | Optimized images, code splitting |
| W2-S5-09 | Accessibility audit (WCAG 2.1 AA) | Frontend | QA Eng | 3h | W2-S5-07 | Accessibility compliance | Passes axe DevTools audit |
| W2-S5-10 | Security audit | Backend | Tech Lead | 2h | W2-S5-07 | Security review document | No critical vulnerabilities |
| W2-S5-11 | Recruit 13 beta testers | Product | Product Mgr | 2h | - | Beta tester onboarding | 13 users ready to test |
| W2-S5-12 | Launch to production | Mixed | DevOps | 2h | W2-S5-10, W2-S5-11 | Production deployment | Live on somatic-canticles.pages.dev |

**Sprint 2.5 Deliverable:** Production-ready application launched

---

## Dependency Graph Visualization

```
WAVE 1: FOUNDATION
==================
Sprint 1.1 (Mixed Setup)
├── Frontend: Next.js + Tailwind + warcraftcn-ui
└── Backend: Workers + D1 + CI/CD
    ↓
Sprint 1.2 (Backend Infrastructure)
├── Schema Design → Migrations → Drizzle
├── Auth Contract → JWT Middleware → Login/Refresh
└── Rate Limiting + Errors
    ↓ (API contracts ready)
Sprint 1.3 (Frontend UI)
├── warcraftcn-ui Extraction
├── Component Library
└── Auth Pages (stubs ready for integration)
    ↓
WAVE 2: FEATURES
================
Sprint 2.1 (Auth Integration - INTERWOVEN)
├── Frontend: NextAuth + Protected Routes
└── Backend: Profile Endpoints
    ←→ Integration: Frontend connects to Backend auth
    ↓
Sprint 2.2 (Biorhythm - BACKEND → FRONTEND)
├── Backend: Calculator → Endpoints → Tests
└── Frontend: Service → Visualizations ← (waits for API)
    ↓
Sprint 2.3 (Chapters - INTERWOVEN)
├── Backend: Schema → Seed → API → Unlock Logic
└── Frontend: Cards → Grid → Detail Page
    ←→ Integration: Unlock check API
    ↓
Sprint 2.4 (Unlock Experience - FRONTEND-HEAVY)
├── Frontend: Animation + Light Pillars + Audio Player
└── Backend: R2 Storage (minimal)
    ↓
Sprint 2.5 (Polish - MIXED)
├── Backend: Progress + Streaks + Achievements
├── Frontend: Dashboard + Gallery
└── QA: Tests + Audit + Launch
```

---

## Key Integration Points

### Daily Sync Points
- **Morning Standup:** Blockers, dependencies, API contract updates
- **Afternoon Check:** Frontend/backend alignment on shared interfaces

### Contract-First Development
1. Backend documents API in `.context/api/`
2. Frontend reviews and provides feedback
3. Backend implements endpoint
4. Frontend integrates with real endpoint
5. Both test together

### Shared Documentation
- `.context/api/` - API contracts (maintained by backend, used by frontend)
- `.context/database/schema.md` - Schema reference
- `.context/errors.md` - Error codes and handling
- `.context/ui/patterns.md` - UI component usage

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Wave 1 Complete | 100% | All sprints 1.1-1.3 tasks done |
| API Contract Coverage | 100% | Every backend endpoint documented |
| Frontend/Backend Sync | Daily | Standups and integration tests |
| Test Coverage | >80% | Critical paths covered |
| Lighthouse Score | >90 | Performance, Accessibility, Best Practices |
| Beta Completion | 80% | 10/13 beta testers complete 3+ chapters |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Frontend blocked waiting for backend | Contract-first: document APIs before implementation |
| Backend changes break frontend | Integration tests run on every PR |
| warcraftcn-ui integration issues | Phase 0 dedicated to UI foundation |
| Auth complexity | JWT tokens aligned between NextAuth and Workers |
| Biorhythm accuracy | Validated against 3+ known calculators |

---

*Generated by Task Master Planner with interwoven wave methodology*
