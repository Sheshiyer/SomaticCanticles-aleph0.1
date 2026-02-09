# Task Master Waves Summary

**Generated:** 2026-02-09  
**Approach:** 2 Interwoven Waves (Frontend ↔ Backend)  
**Total Tasks:** 80 (condensed from 201 for focused delivery)  
**Default Admin:** `admin@somatic-canticles.local` / `SomaticDev44!`

---

## What Are Task Waves?

Instead of traditional siloed development (all backend first, then all frontend), we use **interwoven waves**:

### The Problem with Silos
```
❌ SILO APPROACH (Bad)
Week 1-4: Backend builds all APIs
Week 5-8: Frontend discovers API issues
Week 9: Integration hell
```

### Our Interwoven Waves
```
✅ WAVE APPROACH (Good)
Week 1: Foundation (Mixed setup)
Week 2: Backend contracts → Frontend stubs
Week 3: Frontend components → Backend awareness
Week 4: Auth integration (together)
Week 5: Biorhythm API → Visualization (together)
Week 6: Chapters (together)
Week 7-8: Polish and launch
```

---

## Wave 1: Foundation (Weeks 1-3)

### Sprint 1.1: Project Bootstrap (Mixed)
**Frontend + Backend setup in parallel**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W1-S1-01 | Frontend | Next.js project initialized |
| W1-S1-03 | Backend | Workers project structure |
| W1-S1-06 | Backend | CI/CD pipeline ready |
| W1-S1-09 | Backend | README with admin credentials |

**Pattern:** Both streams set up independently but aware of each other

---

### Sprint 1.2: Core Infrastructure (Backend-Heavy)
**Backend creates foundation, Frontend prepares**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W1-S2-01 | Backend | Database schema designed |
| W1-S2-05 | Backend | Auth API contract documented |
| W1-S2-07 | Backend | Login endpoint works |
| W1-S2-12 | Frontend | Frontend auth stub ready |

**Pattern:** 
1. Backend documents API in `.context/api/`
2. Frontend reviews contract
3. Backend implements
4. Frontend stubs for integration

---

### Sprint 1.3: UI Foundation (Frontend-Heavy)
**Frontend builds components, Backend contracts ready**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W1-S3-02 | Frontend | warcraftcn-ui components extracted |
| W1-S3-04 | Frontend | Light pillar effects integrated |
| W1-S3-06 | Frontend | Auth page layouts ready |
| W1-S3-10 | Frontend | Component documentation |

**Pattern:** Frontend uses auth stubs from Sprint 1.2, ready for real integration

---

## Wave 2: Features (Weeks 4-8)

### Sprint 2.1: Auth Integration (INTERWOVEN)
**Frontend ↔ Backend working together**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W2-S1-01 | Frontend | NextAuth configured |
| W2-S1-02 | Mixed | JWT alignment between systems |
| W2-S1-05 | Backend | Profile endpoints |
| W2-S1-07 | Frontend | Dashboard layout |

**Pattern:** Daily sync - frontend connects to backend auth, issues resolved immediately

---

### Sprint 2.2: Biorhythm Engine (Backend → Frontend)
**Backend builds first, Frontend visualizes**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W2-S2-02 | Backend | Biorhythm calculator |
| W2-S2-03 | Backend | Calculate endpoint |
| W2-S2-07 | Backend | API documented |
| W2-S2-09 | Frontend | Biorhythm wheel SVG |

**Pattern:**
1. Backend builds calculator + endpoints
2. Documents API contract
3. Frontend builds against contract
4. Integration at end of sprint

---

### Sprint 2.3: Chapter System (INTERWOVEN)
**Schema, API, and UI built together**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W2-S3-01 | Backend | Chapter schema |
| W2-S3-03 | Backend | List endpoint |
| W2-S3-07 | Backend | Unlock engine |
| W2-S3-09 | Frontend | Chapter cards |
| W2-S3-11 | Frontend | Chapter detail page |

**Pattern:**
- Backend creates schema → Frontend reviews
- Backend seeds data → Frontend uses real data
- Backend unlock logic → Frontend integrates

---

### Sprint 2.4: Unlock Experience (Frontend-Heavy)
**Frontend builds immersive experience, Backend provides unlock API**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W2-S4-02 | Frontend | 13-second animation |
| W2-S4-03 | Frontend | Light pillars integrated |
| W2-S4-10 | Frontend | Audio player |
| W2-S4-07 | Frontend | Unlock modal |

**Pattern:** Frontend-heavy sprint with minimal backend work (R2 setup for audio)

---

### Sprint 2.5: Polish & Launch (Mixed)
**Everyone works on launch readiness**

| Task | Area | Key Deliverable |
|------|------|-----------------|
| W2-S5-01 | Backend | Progress tracking API |
| W2-S5-04 | Frontend | Progress dashboard |
| W2-S5-06 | Mixed | Unit tests |
| W2-S5-09 | Mixed | Accessibility audit |
| W2-S5-12 | Mixed | Production launch |

**Pattern:** Mixed tasks - QA, testing, deployment, documentation

---

## Key Integration Points

### 1. Contract-First Development
```
Backend documents → Frontend reviews → Backend implements → Frontend integrates
     (1 day)            (1 day)           (2 days)           (2 days)
```

**Documentation in:** `.context/api/*.md`

### 2. Daily Sync Points
- **Morning Standup:** Blockers, API changes, dependency needs
- **Afternoon Check:** Integration status, test together

### 3. Shared Context
- `.context/api/` - API contracts (backend maintains, frontend uses)
- `.context/database/schema.md` - Schema reference
- `.context/errors.md` - Error codes
- `.context/ui/patterns.md` - UI usage

---

## Default Development Credentials

**Seeded automatically in development:**

| Role | Email | Password | Use Case |
|------|-------|----------|----------|
| Admin | `admin@somatic-canticles.local` | `SomaticDev44!` | Full access testing |
| User | `test@example.com` | `TestUser13!` | Regular user testing |

**Seed file:** `.context/database/seed-dev.sql`

---

## File Organization

### Task Planning
```
.context/
├── task-master-waves.md      # Main waves document (80 tasks)
├── TASK_WAVES_SUMMARY.md     # This summary
├── todo.md                   # Current task status
├── implementation-plan.md    # Full 201-task plan (reference)
└── tasks.json                # Machine-readable format
```

### Backend Context (for API contracts)
```
.context/.context/
├── api/
│   ├── auth.md              # Auth API contract ✅
│   ├── endpoints.md         # Full endpoint list
│   └── examples.md          # Request/response examples
├── database/
│   ├── schema.md            # Schema documentation
│   └── seed-dev.sql         # Dev seed data ✅
└── auth/
    ├── overview.md          # Auth architecture
    └── security.md          # Security practices
```

---

## Success Metrics

| Metric | Target | How |
|--------|--------|-----|
| Wave 1 Complete | 100% | Sprints 1.1-1.3 done |
| API Contracts | 100% | Every endpoint documented |
| Frontend/Backend Sync | Daily | Standups + integration |
| Test Coverage | >80% | Critical paths covered |
| Lighthouse Score | >90 | Performance + Accessibility |

---

## Quick Commands

```bash
# Start development
bun install
bun run db:migrate
bun run db:seed        # Seeds admin + test user
bun run dev

# Login with:
# admin@somatic-canticles.local / SomaticDev44!

# Run tests
bun test
bun test:e2e

# Deploy
bun run deploy:workers
bun run deploy:pages
```

---

## Next Steps

1. **Review** `task-master-waves.md` for full task details
2. **Start** Wave 1, Sprint 1.1
3. **Assign** tasks to frontend/backend owners
4. **Daily** sync on integration points

---

*"Interwoven waves, not silos. Continuous integration, not big bang."*
