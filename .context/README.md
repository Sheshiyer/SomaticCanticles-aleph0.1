# Somatic-Canticles Webapp

**Biorhythm-synchronized webapp for embodied consciousness practice**

[![Status](https://img.shields.io/badge/status-fresh_start-orange)]() [![Tech](https://img.shields.io/badge/stack-Next.js%20%2B%20Cloudflare%20Workers-blue)]() [![UI](https://img.shields.io/badge/UI-warcraftcn--ui-purple)](https://github.com/TheOrcDev/warcraftcn-ui)

---

## ⚠️ FRESH START (2026-02-09)

This project has been reset to **NOT DONE** status. We are using [warcraftcn-ui](https://github.com/TheOrcDev/warcraftcn-ui) as our UI foundation.

**Previous work archived in:** `memory.md` (for reference only)

---

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (v1.0+)
- [Node.js](https://nodejs.org/) (v18+)
- Cloudflare account (for D1 database)
- Git

### Installation

```bash
# Clone repository
git clone <repo-url>
cd Somatic-Canticles-Webapp

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations
bun run db:migrate

# Seed development data (includes default admin)
bun run db:seed

# Start development server
bun run dev
```

### Development URLs
- **Frontend:** http://localhost:3000
- **Workers API:** http://localhost:8787
- **Database:** Local D1 (SQLite)

---

## 🔑 Default Development Credentials

**For local development only - NEVER use in production**

| Account | Email | Password |
|---------|-------|----------|
| **Admin** | `admin@somatic-canticles.local` | `SomaticDev44!` |
| **Test User** | `test@example.com` | `TestUser13!` |

These accounts are automatically created when you run `bun run db:seed`.

---

## 📋 Task Master Waves

Tasks are organized into **2 interwoven waves** (not silos):

### Wave 1: Foundation (Weeks 1-3)
Setup infrastructure, tooling, and UI foundation.

| Sprint | Focus | Pattern |
|--------|-------|---------|
| 1.1 | Project Bootstrap | Mixed (Frontend + Backend setup) |
| 1.2 | Core Infrastructure | Backend-heavy (Auth, DB, API) |
| 1.3 | UI Foundation | Frontend-heavy (warcraftcn-ui components) |

**Detailed plan:** [`.context/task-master-waves.md`](.context/task-master-waves.md)

### Wave 2: Features (Weeks 4-8)
Build features with interdependent frontend/backend tasks.

| Sprint | Focus | Pattern |
|--------|-------|---------|
| 2.1 | Auth & User | Interwoven (Frontend ↔ Backend) |
| 2.2 | Biorhythm Engine | Backend → Frontend |
| 2.3 | Chapter System | Interwoven |
| 2.4 | Unlock Experience | Frontend-heavy (13-second animation) |
| 2.5 | Polish & Launch | Mixed (Testing, deployment) |

**Key principle:** Backend creates API contracts first (documented in `.context/api/`), frontend builds against them. Integration happens continuously.

---

## 🏗️ Architecture

```
Frontend (Next.js 14)
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/
│   │   └── ui/           # warcraftcn-ui components
│   └── lib/
│       ├── auth/         # Authentication
│       ├── biorhythm/    # Biorhythm calculations
│       └── db/           # Database client
│
Backend (Cloudflare Workers)
├── workers/
│   ├── api/              # API endpoints
│   │   ├── auth/         # Auth endpoints
│   │   ├── biorhythm/    # Biorhythm API
│   │   └── chapters/     # Chapter API
│   └── migrations/       # D1 migrations
│
Documentation
├── .context/             # AI context system
│   ├── api/              # API contracts
│   ├── database/         # Schema docs
│   └── ui/               # UI patterns
│
└── .docs/                # Project documentation
```

---

## 🎨 UI Foundation: warcraftcn-ui

We use [warcraftcn-ui](https://github.com/TheOrcDev/warcraftcn-ui) as our component foundation:

- **Aesthetic:** Warcraft/RTS retro style adapted for wellness theme
- **Key Feature:** Light pillar effects for 13-second unlock animations
- **Components:** Buttons, Cards, Modals, Forms, Navigation
- **Accessibility:** ARIA-compliant out of the box

**Integration guide:** [`.context/ui/warcraftcn-ui-integration.md`](.context/ui/warcraftcn-ui-integration.md)

---

## 🗄️ Database

**Platform:** Cloudflare D1 (SQLite at edge)

### Key Tables
- `users` - User accounts and profiles
- `chapters` - 12 chapter definitions
- `user_progress` - Chapter completion tracking
- `biorhythm_snapshots` - Daily biorhythm calculations
- `streaks` - User streak tracking
- `achievements` - Achievement unlocks

### Commands
```bash
# Run migrations
bun run db:migrate

# Seed development data
bun run db:seed

# Reset database
bun run db:reset
```

**Schema documentation:** [`.context/database/schema.md`](.context/database/schema.md)

---

## 🔐 Authentication

**Stack:** NextAuth.js (frontend) + JWT (Workers API)

### Auth Flow
1. User logs in via NextAuth credentials or OAuth
2. Frontend obtains JWT from Workers `/auth/login`
3. JWT stored in httpOnly cookie
4. Subsequent API calls include JWT in Authorization header
5. Workers middleware validates JWT

### Supported Providers
- Email/Password (credentials)
- Google OAuth
- GitHub OAuth

**Auth documentation:** [`.context/auth/overview.md`](.context/auth/overview.md)

---

## 📡 API

**Base URL:** `https://api.somatic-canticles.com` (production)

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Authenticate user |
| `/auth/refresh` | POST | Refresh JWT token |
| `/user/profile` | GET/PUT | User profile management |
| `/biorhythm/calculate` | POST | Calculate biorhythm cycles |
| `/biorhythm/predict` | GET | 30-day biorhythm forecast |
| `/chapters/list` | GET | List all chapters |
| `/chapters/:id` | GET | Get chapter detail |
| `/chapters/check-unlock` | POST | Check unlockable chapters |

**Full API docs:** [`.context/api/endpoints.md`](.context/api/endpoints.md)

---

## 🚀 Deployment

### Automatic (CI/CD)
Push to `main` branch triggers:
1. Lint and type check
2. Build application
3. Run tests
4. Deploy to Cloudflare Pages (frontend)
5. Deploy to Cloudflare Workers (API)
6. Run database migrations

### Manual
```bash
# Deploy Workers
bun run deploy:workers

# Deploy Pages
bun run deploy:pages

# Run migrations
bun run db:migrate:prod
```

---

## 🧪 Testing

```bash
# Run unit tests
bun test

# Run E2E tests
bun test:e2e

# Type check
bun run type-check

# Lint
bun run lint
```

---

## 📊 Monitoring

- **Errors:** Sentry (configured for client/server/edge)
- **Analytics:** Google Analytics 4
- **Performance:** Cloudflare Analytics
- **Uptime:** Cloudflare Pages monitoring

---

## 🔢 Power Numbers

This project uses sacred geometry numbers throughout:

| Number | Meaning | Usage |
|--------|---------|-------|
| **8** | Breath cycles | Animation timing, spacing |
| **13** | Transformation | Unlock duration (13 seconds) |
| **19** | Solar sync | Daily check-ins |
| **44** | Structure | Grid base, launch cycle |
| **21** | Completion | Line height, world building |
| **125** | Creative cycles | Major milestones |
| **152** | Unity bridge | Progress connections |

---

## 📚 Documentation Structure

```
.context/                    # AI context system
├── task-master-waves.md    # This task plan
├── .context/               # Technical documentation
│   ├── api/                # API contracts
│   ├── auth/               # Auth docs
│   ├── database/           # Schema docs
│   └── ui/                 # UI patterns
├── todo.md                 # Current tasks
├── memory.md               # Project memory
└── implementation-plan.md  # Full 201-task plan

.docs/                       # Project documentation
├── 00-Project-Hub/         # Vision, roadmap
├── 01-Planning/            # Kanban, sprints
├── 02-Design/              # Visual design
└── ...
```

---

## 🤝 Contributing

1. Check `todo.md` for available tasks
2. Pick a task from current sprint
3. Create feature branch: `git checkout -b feature/W1-S1-01`
4. Follow conventions in `.context/guidelines.md`
5. Submit PR with clear description

---

## ⚠️ Important Notes

- **Nothing is done:** All tasks reset to NOT DONE
- **Phase 0 first:** Complete warcraftcn-ui integration before features
- **Contract-first:** Backend documents APIs before implementation
- **Integration continuously:** Not at the end of sprints
- **Use .context/:** Put relevant docs in appropriate subdirectories

---

## 📞 Support

- **Issues:** Check `.context/memory.md` for error patterns
- **Questions:** Review `.context/` documentation first
- **Architecture:** See `.context/architecture/overview.md`

---

*"Every task is an octave, every commit a transformation."*
