# Somatic-Canticles Webapp — Implementation Plan

**Generated:** 2026-02-09 (Fresh Start)  
**Scope:** Full webapp build from scratch with warcraftcn-ui  
**Task Count:** 201 microtasks (187 original + 14 warcraftcn-ui integration)  
**Duration:** 8 weeks (44 days per power number)  
**Tech Stack:** Next.js + Cloudflare Workers + D1 + Bun + warcraftcn-ui  
**UI Foundation:** https://github.com/TheOrcDev/warcraftcn-ui  

---

## ⚠️ CRITICAL: NOTHING IS DONE - FRESH START

**Previous work (2026-02-03 to 2026-02-07) has been archived to memory.md.**

We are starting **COMPLETELY FRESH** with warcraftcn-ui as our UI foundation. Do not assume any previous work is usable.

---

## 🎯 Project Summary

Build a biorhythm-synchronized webapp that unlocks 12 chapters of embodied consciousness practice through sound, breath, and somatic work. Users enter their birth data, the system calculates their physical/emotional/intellectual/spiritual cycles, and unlocks content when cycles peak.

**UI Foundation:** [warcraftcn-ui](https://github.com/TheOrcDev/warcraftcn-ui) — Warcraft-themed retro UI components with light pillar effects

**Reference Documents:**
- `.docs/00-Project-Hub/README.md` — Vision, scope, power numbers
- `.docs/01-Planning/roadmap/Roadmap.md` — 8-week roadmap
- `.docs/02-Design/canvas/Visual-Canvas.md` — UI/UX design system
- `.context/tech-stack.md` — Canonical tech choices
- `.context/tooling-and-services.md` — Services (NextAuth, Sentry, GA4, etc.)

**Build Location:** 
- `/src/` at repository root (no project-name subfolder)
- `/workers/` for Cloudflare Workers (API layer)
- `.context/` and `.docs/` are reference only

---

## 🎨 warcraftcn-ui Integration

**Repository:** https://github.com/TheOrcDev/warcraftcn-ui  
**Description:** Accessible, retro-inspired UI components with RTS aesthetics

### Why warcraftcn-ui?
- Warcraft/RTS-inspired retro aesthetic for immersive experience
- Pre-built accessible components (buttons, cards, modals, etc.)
- Light pillar effects and atmospheric UI elements
- Built for modern Next.js/React apps
- Fully open source - copy, paste, customize

### Integration Strategy
1. **Phase 0**: Extract and adapt warcraftcn-ui components before building app features
2. **Adaptation**: Transform "war" aesthetic to "wonder" - keep atmospheric effects, soften aggressive elements
3. **Color System**: Merge warcraftcn-ui palette with power-number colors
4. **Components**: Use warcraftcn-ui as base for all UI components

---

## 🏗️ Architecture Overview

```
Somatic-Canticles-Webapp/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── (auth)/             # Auth routes
│   │   ├── dashboard/          # User dashboard
│   │   ├── chapters/           # Chapter pages
│   │   └── api/                # Next.js API routes (NextAuth)
│   ├── components/
│   │   ├── ui/                 # warcraftcn-ui components (BASE)
│   │   ├── biorhythm/          # Biorhythm visualizations
│   │   ├── audio/              # Audio player components
│   │   └── chapters/           # Chapter-specific components
│   ├── lib/
│   │   ├── biorhythm/          # Biorhythm calculation engine
│   │   ├── db/                 # D1 database client
│   │   └── utils/              # Shared utilities
│   └── styles/                 # Global styles, Tailwind config
├── workers/
│   ├── api/                    # Cloudflare Workers API
│   │   ├── auth/               # JWT auth endpoints
│   │   ├── biorhythm/          # Biorhythm calculations
│   │   ├── chapters/           # Chapter unlock logic
│   │   └── progress/           # User progress tracking
│   └── migrations/             # D1 schema migrations
├── public/
│   ├── audio/                  # Canticle audio files
│   └── images/                 # Visual assets
└── .context/                   # Reference docs (read-only)
```

---

## 📋 Workplan

### PHASE 0: warcraftcn-ui Integration (NEW - Before Phase 1)
**Objective:** Establish UI foundation with warcraftcn-ui components

#### Sprint 0.1: UI Foundation Setup
- [ ] **P0-S1-01** [2h] Clone and analyze warcraftcn-ui repository structure
- [ ] **P0-S1-02** [2h] Map warcraftcn-ui components to project needs
- [ ] **P0-S1-03** [2h] Extract and adapt core UI components (Button, Card, Modal)
- [ ] **P0-S1-04** [3h] Adapt warcraftcn-ui color system to power-number palette
- [ ] **P0-S1-05** [2h] Integrate light-pillar atmospheric effects
- [ ] **P0-S1-06** [2h] Set up component documentation/storybook
- [ ] **P0-S1-07** [2h] Create warcraftcn-ui integration guide for team

#### Sprint 0.2: Design System Migration
- [ ] **P0-S2-01** [3h] Migrate Visual-Canvas.md design tokens to warcraftcn-ui format
- [ ] **P0-S2-02** [4h] Build biorhythm-themed components (cycle wheels, peak indicators)
- [ ] **P0-S2-03** [3h] Create chapter card components (locked/unlocked states)
- [ ] **P0-S2-04** [4h] Design unlock animation sequence (13-second with light pillars)
- [ ] **P0-S2-05** [3h] Build audio player with waveform visualization
- [ ] **P0-S2-06** [2h] Create navigation components (header, sidebar, mobile nav)
- [ ] **P0-S2-07** [2h] Implement dark/light mode theming

---

### PHASE 1: Foundation & Core Systems (Weeks 1-2) ✅ PARALLEL DISPATCH POINT
**Objective:** Project scaffolding with warcraftcn-ui, biorhythm engine, database schema

#### Sprint 1.1: Project Setup (Week 1, Days 1-3)
- [ ] **P1-S1-01** [2h] Initialize Next.js 14 project with TypeScript + Bun
- [ ] **P1-S1-02** [1h] Configure Tailwind CSS with warcraftcn-ui + power-number colors
- [ ] **P1-S1-03** [2h] Set up Cloudflare Workers project structure
- [ ] **P1-S1-04** [2h] Configure D1 database (local + remote)
- [ ] **P1-S1-05** [1h] Set up Bun package manager (bun.lockb)
- [ ] **P1-S1-06** [2h] Install dependencies (warcraftcn-ui base, framer-motion, etc.)
- [ ] **P1-S1-07** [1h] Create environment variable structure (.env.example)
- [ ] **P1-S1-08** [2h] Set up GitHub Actions CI/CD pipeline
- [ ] **P1-S1-09** [1h] Configure Sentry for error tracking
- [ ] **P1-S1-10** [1h] Configure Google Analytics (GA4)
- [ ] **P1-S1-11** [2h] Set up Cloudflare Pages deployment config
- [ ] **P1-S1-12** [1h] Create README and developer docs

#### Sprint 1.2: Biorhythm Calculation Engine (Week 1, Days 4-7) 🔥 CRITICAL PATH
**PARALLEL AGENT A: Biorhythm Core**
- [ ] **P1-S2-01** [4h] Research + document biorhythm calculation algorithms
- [ ] **P1-S2-02** [6h] Build core biorhythm calculator (physical/emotional/intellectual/spiritual)
- [ ] **P1-S2-03** [4h] Implement birth date input validation
- [ ] **P1-S2-04** [3h] Add timezone handling for accurate calculations
- [ ] **P1-S2-05** [4h] Create biorhythm state prediction (next 30 days)
- [ ] **P1-S2-06** [3h] Build cycle peak detection algorithm
- [ ] **P1-S2-07** [2h] Add sunrise/sunset calculation (for Chapter 1 unlock)
- [ ] **P1-S2-08** [4h] Write unit tests for biorhythm calculator (100% coverage)
- [ ] **P1-S2-09** [2h] Validate against known biorhythm calculators
- [ ] **P1-S2-10** [2h] Document biorhythm API contract

**PARALLEL AGENT B: Database Schema**
- [ ] **P1-S2-11** [3h] Design D1 database schema (users, chapters, progress, unlocks)
- [ ] **P1-S2-12** [2h] Create migration scripts for D1
- [ ] **P1-S2-13** [2h] Set up database client library (Drizzle ORM or raw SQL)
- [ ] **P1-S2-14** [2h] Implement user model (id, email, birthdate, timezone)
- [ ] **P1-S2-15** [2h] Implement chapter progress model (chapter_id, unlock_date, completion)
- [ ] **P1-S2-16** [2h] Implement biorhythm snapshot model (date, cycles, peaks)
- [ ] **P1-S2-17** [2h] Add indexes for performance (user_id, date ranges)
- [ ] **P1-S2-18** [2h] Write database seed script (test data)
- [ ] **P1-S2-19** [2h] Test migrations + rollback procedures

**PARALLEL AGENT C: Auth Foundation**
- [ ] **P1-S2-20** [4h] Set up NextAuth.js configuration
- [ ] **P1-S2-21** [3h] Configure credentials provider (email/password)
- [ ] **P1-S2-22** [2h] Add Google OAuth provider
- [ ] **P1-S2-23** [2h] Add GitHub OAuth provider (optional)
- [ ] **P1-S2-24** [3h] Create JWT token strategy (align with Workers API)
- [ ] **P1-S2-25** [2h] Implement session management
- [ ] **P1-S2-26** [2h] Create protected route middleware
- [ ] **P1-S2-27** [3h] Build Cloudflare Workers auth endpoints (/auth/login, /auth/refresh)
- [ ] **P1-S2-28** [2h] Implement password hashing (Argon2id)
- [ ] **P1-S2-29** [2h] Add rate limiting for auth endpoints

#### Sprint 1.3: Chapter Data Structure (Week 2, Days 8-10)
- [ ] **P1-S3-01** [3h] Define chapter data model (id, title, cycle, unlock_trigger, content)
- [ ] **P1-S3-02** [4h] Create JSON schema for all 12 chapters
- [ ] **P1-S3-03** [2h] Map chapters to biorhythm unlock triggers
- [ ] **P1-S3-04** [2h] Add chapter dependency logic (Chapter 2 requires Chapter 1, etc.)
- [ ] **P1-S3-05** [3h] Create chapter metadata (duration, canticle_id, practices)
- [ ] **P1-S3-06** [2h] Build chapter seed data
- [ ] **P1-S3-07** [2h] Write chapter data validation tests

#### Sprint 1.4: API Foundation (Week 2, Days 11-14)
**PARALLEL AGENT D: Workers API**
- [ ] **P1-S4-01** [3h] Set up Cloudflare Workers routing
- [ ] **P1-S4-02** [2h] Create API error handling middleware
- [ ] **P1-S4-03** [2h] Add request logging (Sentry integration)
- [ ] **P1-S4-04** [3h] Build `/biorhythm/calculate` endpoint
- [ ] **P1-S4-05** [3h] Build `/biorhythm/predict` endpoint (30-day forecast)
- [ ] **P1-S4-06** [3h] Build `/chapters/list` endpoint
- [ ] **P1-S4-07** [3h] Build `/chapters/:id` endpoint
- [ ] **P1-S4-08** [3h] Build `/chapters/unlocked` endpoint (user-specific)
- [ ] **P1-S4-09** [2h] Add CORS configuration
- [ ] **P1-S4-10** [2h] Write API integration tests

---

### PHASE 2: UI Scaffolding & Component Library (Week 3) ✅ PARALLEL DISPATCH POINT
**Objective:** Build reusable UI components using warcraftcn-ui foundation

#### Sprint 2.1: warcraftcn-ui Integration (Days 15-17)
**PARALLEL AGENT E: Design Tokens**
- [ ] **P2-S1-01** [2h] Configure Tailwind with warcraftcn-ui tokens
- [ ] **P2-S1-02** [2h] Set up typography scale (44px, 21px, 19px, 13px)
- [ ] **P2-S1-03** [2h] Create spacing scale (8px increments)
- [ ] **P2-S1-04** [2h] Add animation timing (8-beat rhythm, 13-second transitions)
- [ ] **P2-S1-05** [2h] Configure line-height (1.618 golden ratio)
- [ ] **P2-S1-06** [2h] Set up gradient utilities (8→19, 13→44, 21→152)
- [ ] **P2-S1-07** [2h] Create color mode system (light/dark)
- [ ] **P2-S1-08** [2h] Document design tokens in Storybook

**PARALLEL AGENT F: warcraftcn-ui Components**
- [ ] **P2-S1-09** [3h] Extract button components from warcraftcn-ui (primary, secondary, ghost)
- [ ] **P2-S1-10** [2h] Extract form components (input, textarea, select)
- [ ] **P2-S1-11** [2h] Extract card components
- [ ] **P2-S1-12** [2h] Extract modal/dialog components
- [ ] **P2-S1-13** [2h] Extract loader/spinner components
- [ ] **P2-S1-14** [2h] Customize components with power number colors
- [ ] **P2-S1-15** [2h] Integrate light-pillar atmospheric effects
- [ ] **P2-S1-16** [2h] Write component usage docs

#### Sprint 2.2: Core UI Components (Days 18-21)
**PARALLEL AGENT G: Layout Components**
- [ ] **P2-S2-01** [3h] Build navigation header (warcraftcn-ui style)
- [ ] **P2-S2-02** [2h] Build sidebar navigation
- [ ] **P2-S2-03** [2h] Build footer
- [ ] **P2-S2-04** [3h] Create responsive layout wrapper
- [ ] **P2-S2-05** [2h] Add mobile menu component
- [ ] **P2-S2-06** [2h] Build breadcrumb navigation

**PARALLEL AGENT H: Biorhythm Visualizations**
- [ ] **P2-S2-07** [6h] Build biorhythm wheel component (SVG) with warcraftcn-ui styling
- [ ] **P2-S2-08** [4h] Create cycle graph component (line chart)
- [ ] **P2-S2-09** [3h] Build percentage bar component
- [ ] **P2-S2-10** [3h] Add animated transitions for cycle changes
- [ ] **P2-S2-11** [2h] Create peak indicator component
- [ ] **P2-S2-12** [2h] Build 30-day forecast visualization
- [ ] **P2-S2-13** [2h] Add color coding (Physical=red, Emotional=purple, etc.)
- [ ] **P2-S2-14** [2h] Make visualizations responsive

**PARALLEL AGENT I: Chapter Components**
- [ ] **P2-S2-15** [4h] Build chapter card component (locked/unlocked states) - warcraftcn-ui style
- [ ] **P2-S2-16** [3h] Create chapter grid layout
- [ ] **P2-S2-17** [4h] Build chapter detail view
- [ ] **P2-S2-18** [3h] Add progress indicator (% complete)
- [ ] **P2-S2-19** [2h] Create chapter metadata display (cycle, trigger, duration)

---

### PHASE 3: Chapter Unlock System (Week 4) 🔥 CRITICAL PATH
**Objective:** Implement biorhythm → chapter mapping, unlock logic, animations with warcraftcn-ui effects

#### Sprint 3.1: Unlock Logic (Days 22-24)
- [ ] **P3-S1-01** [4h] Build unlock trigger evaluation engine
- [ ] **P3-S1-02** [3h] Map biorhythm states to chapter unlock conditions
- [ ] **P3-S1-03** [4h] Implement "high physical + sunrise" trigger (Chapter 1)
- [ ] **P3-S1-04** [3h] Implement "sustained high physical" trigger (Chapter 2)
- [ ] **P3-S1-05** [3h] Implement peak-based triggers (Chapters 3, 6, 9, 12)
- [ ] **P3-S1-06** [3h] Implement flow-state triggers (Chapters 4, 5, 7, 8)
- [ ] **P3-S1-07** [3h] Implement transcendent triggers (Chapters 10, 11)
- [ ] **P3-S1-08** [2h] Add unlock cooldown logic (prevent spam unlocks)
- [ ] **P3-S1-09** [3h] Create unlock notification system
- [ ] **P3-S1-10** [4h] Build Workers API endpoint for unlock checks
- [ ] **P3-S1-11** [3h] Write comprehensive unlock logic tests

#### Sprint 3.2: Unlock Animations (Days 25-28) ✅ PARALLEL DISPATCH POINT
**PARALLEL AGENT J: 13-Second Unlock Sequence**
- [ ] **P3-S2-01** [4h] Design unlock animation sequence with light-pillar effects
- [ ] **P3-S2-02** [6h] Build unlock animation with Framer Motion + warcraftcn-ui effects
- [ ] **P3-S2-03** [3h] Add 8-beat rhythm pulse effect
- [ ] **P3-S2-04** [3h] Add color transformation (13 colors)
- [ ] **P3-S2-05** [3h] Add geometric expansion (19-point mandala)
- [ ] **P3-S2-06** [3h] Add light pillar atmospheric effects
- [ ] **P3-S2-07** [2h] Add chapter reveal effect
- [ ] **P3-S2-08** [2h] Optimize animation performance
- [ ] **P3-S2-09** [2h] Add reduced motion variant (accessibility)

**PARALLEL AGENT K: Unlock UI Flow**
- [ ] **P3-S2-10** [3h] Create unlock modal component (warcraftcn-ui style)
- [ ] **P3-S2-11** [2h] Build unlock notification toast
- [ ] **P3-S2-12** [3h] Add chapter preview on unlock
- [ ] **P3-S2-13** [2h] Create "New Chapter Available" badge
- [ ] **P3-S2-14** [2h] Build unlock history view

---

### PHASE 4: Audio System (Week 5) ✅ PARALLEL DISPATCH POINT
**Objective:** Audio player, canticle playback, waveform visualization with warcraftcn-ui styling

#### Sprint 4.1: Audio Infrastructure (Days 29-31)
**PARALLEL AGENT L: Audio Storage**
- [ ] **P4-S1-01** [2h] Set up Cloudflare R2 bucket for audio files
- [ ] **P4-S1-02** [2h] Configure CORS for audio streaming
- [ ] **P4-S1-03** [2h] Create audio upload script (for canticles)
- [ ] **P4-S1-04** [1h] Add audio metadata (duration, file size, format)
- [ ] **P4-S1-05** [2h] Implement audio CDN/caching strategy

**PARALLEL AGENT M: Audio Player**
- [ ] **P4-S1-06** [6h] Build custom audio player component (warcraftcn-ui style)
- [ ] **P4-S1-07** [3h] Add play/pause controls
- [ ] **P4-S1-08** [3h] Add progress scrubbing
- [ ] **P4-S1-09** [2h] Add volume control
- [ ] **P4-S1-10** [2h] Add playback speed control (0.5x, 1x, 1.5x)
- [ ] **P4-S1-11** [3h] Implement keyboard shortcuts (space=play/pause, arrows=seek)
- [ ] **P4-S1-12** [2h] Add mobile touch controls

#### Sprint 4.2: Audio Visualization (Days 32-35)
**PARALLEL AGENT N: Waveform Visualization**
- [ ] **P4-S2-01** [6h] Build waveform generator from audio files
- [ ] **P4-S2-02** [4h] Create animated waveform component
- [ ] **P4-S2-03** [3h] Add frequency-based color coding (bass=red, voice=purple, bells=gold)
- [ ] **P4-S2-04** [3h] Implement 8-beat rhythm visualization
- [ ] **P4-S2-05** [3h] Create 13-beat Fibonacci spiral mode
- [ ] **P4-S2-06** [3h] Create 19-beat solar mandala mode
- [ ] **P4-S2-07** [2h] Add synchronized animation with playback
- [ ] **P4-S2-08** [2h] Optimize canvas rendering performance

---

### PHASE 5: Pages & User Flows (Week 6) ✅ PARALLEL DISPATCH POINT
**Objective:** Build all user-facing pages using warcraftcn-ui components

#### Sprint 5.1: Auth Pages (Days 36-38)
**PARALLEL AGENT O: Auth UI**
- [ ] **P5-S1-01** [3h] Build landing page (hero, value prop, CTA) - warcraftcn-ui aesthetic
- [ ] **P5-S1-02** [3h] Create login page
- [ ] **P5-S1-03** [3h] Create signup page (with birth data collection)
- [ ] **P5-S1-04** [2h] Add password reset flow
- [ ] **P5-S1-05** [2h] Add email verification flow
- [ ] **P5-S1-06** [2h] Build OAuth consent screens
- [ ] **P5-S1-07** [2h] Add onboarding flow (birth date, timezone)

#### Sprint 5.2: Dashboard (Days 39-42)
**PARALLEL AGENT P: Dashboard UI**
- [ ] **P5-S2-01** [4h] Build main dashboard layout (warcraftcn-ui style)
- [ ] **P5-S2-02** [3h] Add "Today's Unlock" hero section
- [ ] **P5-S2-03** [3h] Add biorhythm visualization (wheel + bars)
- [ ] **P5-S2-04** [3h] Add chapter map view (12 chapters, lock states)
- [ ] **P5-S2-05** [2h] Add daily check-in prompt
- [ ] **P5-S2-06** [2h] Add streak counter (7, 13, 21, 44-day streaks)
- [ ] **P5-S2-07** [2h] Add recent activity feed
- [ ] **P5-S2-08** [2h] Add quick links (library, profile, settings)

**PARALLEL AGENT Q: Chapter Pages**
- [ ] **P5-S2-09** [4h] Build chapter detail page layout
- [ ] **P5-S2-10** [3h] Add chapter content sections (intro, practice, reflection)
- [ ] **P5-S2-11** [3h] Add embedded audio player
- [ ] **P5-S2-12** [2h] Add "Mark as Complete" button
- [ ] **P5-S2-13** [2h] Add chapter navigation (prev/next)
- [ ] **P5-S2-14** [2h] Add chapter notes/journal feature
- [ ] **P5-S2-15** [2h] Add chapter sharing (social links)

---

### PHASE 6: Progress Tracking & Streaks (Week 7) ✅ PARALLEL DISPATCH POINT
**Objective:** User progress, achievement system, streak tracking

#### Sprint 6.1: Progress System (Days 43-45)
**PARALLEL AGENT R: Progress Tracking**
- [ ] **P6-S1-01** [3h] Build progress tracking API endpoints
- [ ] **P6-S1-02** [3h] Implement chapter completion logic
- [ ] **P6-S1-03** [2h] Track time spent per chapter
- [ ] **P6-S1-04** [2h] Track audio playback completion
- [ ] **P6-S1-05** [3h] Build progress analytics (completion %, avg time)
- [ ] **P6-S1-06** [2h] Add progress export (CSV/JSON)

#### Sprint 6.2: Streak & Achievement System (Days 46-49)
**PARALLEL AGENT S: Streaks**
- [ ] **P6-S2-01** [4h] Build daily streak tracker (7, 13, 21, 44-day)
- [ ] **P6-S2-02** [3h] Implement biorhythm-specific streaks (Morning, Flow, Solar, Build)
- [ ] **P6-S2-03** [3h] Add streak notifications (daily reminders)
- [ ] **P6-S2-04** [2h] Build streak recovery logic ("freeze" system)
- [ ] **P6-S2-05** [3h] Create achievement system (Novice Witness, Transformation Initiate, etc.)
- [ ] **P6-S2-06** [3h] Design achievement badges (8 achievements) - warcraftcn-ui style
- [ ] **P6-S2-07** [2h] Add achievement unlock animations
- [ ] **P6-S2-08** [2h] Build achievement gallery page

---

### PHASE 7: Content Creation & Polish (Week 8) ✅ PARALLEL DISPATCH POINT
**Objective:** Content population, testing, performance optimization

#### Sprint 7.1: Content Population (Days 50-52)
**PARALLEL AGENT T: Chapter Content**
- [ ] **P7-S1-01** [6h] Write content for Chapters 1-3 (Physical Cycle)
- [ ] **P7-S1-02** [6h] Write content for Chapters 4-6 (Emotional Cycle)
- [ ] **P7-S1-03** [6h] Write content for Chapters 7-9 (Intellectual Cycle)
- [ ] **P7-S1-04** [6h] Write content for Chapters 10-12 (Spiritual Cycle)

**PARALLEL AGENT U: Audio Recording**
- [ ] **P7-S1-05** [4h] Record Morning Octave (Chapter 1)
- [ ] **P7-S1-06** [4h] Record Terpsichore's Dance (Chapter 2)
- [ ] **P7-S1-07** [4h] Record Earth Resonance (Chapter 3)
- [ ] **P7-S1-08** [4h] Record Heart Harmonics (Chapter 4)
- [ ] **P7-S1-09** [4h] Record Melpomene's Lament (Chapter 5)
- [ ] **P7-S1-10** [4h] Record Solar Plexus Song (Chapter 6)

#### Sprint 7.2: Testing & QA (Days 53-56)
**PARALLEL AGENT V: Testing**
- [ ] **P7-S2-01** [4h] Write unit tests for biorhythm calculator
- [ ] **P7-S2-02** [4h] Write unit tests for unlock logic
- [ ] **P7-S2-03** [4h] Write integration tests for API endpoints
- [ ] **P7-S2-04** [4h] Write E2E tests (Playwright) for user flows
- [ ] **P7-S2-05** [3h] Test mobile responsiveness (iOS, Android)
- [ ] **P7-S2-06** [3h] Test cross-browser compatibility
- [ ] **P7-S2-07** [3h] Accessibility audit (WCAG 2.1 AA)
- [ ] **P7-S2-08** [2h] Performance testing (Lighthouse)

**PARALLEL AGENT W: Performance Optimization**
- [ ] **P7-S2-09** [3h] Optimize image loading (WebP, lazy loading)
- [ ] **P7-S2-10** [3h] Optimize audio streaming (chunked transfer)
- [ ] **P7-S2-11** [2h] Add service worker for offline support
- [ ] **P7-S2-12** [2h] Optimize bundle size (code splitting)
- [ ] **P7-S2-13** [2h] Add Redis caching for biorhythm calculations
- [ ] **P7-S2-14** [2h] Optimize database queries (indexes, N+1)

---

### PHASE 8: Beta Testing & Launch (Days 57-62)
**Objective:** Beta testing, feedback integration, public launch

#### Sprint 8.1: Beta Testing (Days 57-59)
- [ ] **P8-S1-01** [2h] Recruit 13 beta testers (power number)
- [ ] **P8-S1-02** [2h] Set up feedback collection system
- [ ] **P8-S1-03** [4h] Monitor beta user behavior (analytics)
- [ ] **P8-S1-04** [3h] Conduct user interviews (3-5 users)
- [ ] **P8-S1-05** [2h] Document bug reports
- [ ] **P8-S1-06** [4h] Fix critical bugs
- [ ] **P8-S1-07** [2h] Implement high-priority feedback

#### Sprint 8.2: Launch Preparation (Days 60-62)
- [ ] **P8-S2-01** [3h] Write launch blog post
- [ ] **P8-S2-02** [2h] Create social media assets
- [ ] **P8-S2-03** [2h] Set up marketing landing page
- [ ] **P8-S2-04** [2h] Configure production environment
- [ ] **P8-S2-05** [1h] Final security audit
- [ ] **P8-S2-06** [2h] Deploy to Cloudflare Pages/Workers
- [ ] **P8-S2-07** [1h] Test production deployment
- [ ] **P8-S2-08** [1h] Public launch! 🚀

---

## 🎯 Parallel Dispatch Points

**Where to use parallel agents:**

1. **Phase 0, Sprint 0.1-0.2** (Pre-Phase 1)
   - Agent W1: warcraftcn-ui component extraction
   - Agent W2: Design system migration

2. **Phase 1, Sprint 1.2** (Week 1, Days 4-7)
   - Agent A: Biorhythm core calculator
   - Agent B: Database schema + migrations
   - Agent C: Auth foundation (NextAuth + Workers)

3. **Phase 2, Sprint 2.1** (Week 3, Days 15-17)
   - Agent E: Design tokens + Tailwind config
   - Agent F: warcraftcn-ui component integration

4. **Phase 2, Sprint 2.2** (Week 3, Days 18-21)
   - Agent G: Layout components
   - Agent H: Biorhythm visualizations
   - Agent I: Chapter components

5. **Phase 3, Sprint 3.2** (Week 4, Days 25-28)
   - Agent J: 13-second unlock animation sequence
   - Agent K: Unlock UI flow (modal, notifications)

6. **Phase 4, Sprint 4.1** (Week 5, Days 29-31)
   - Agent L: Audio storage (R2 setup)
   - Agent M: Audio player component

7. **Phase 4, Sprint 4.2** (Week 5, Days 32-35)
   - Agent N: Waveform visualization

8. **Phase 5, Sprint 5.1-5.2** (Week 6, Days 36-42)
   - Agent O: Auth pages
   - Agent P: Dashboard UI
   - Agent Q: Chapter pages

9. **Phase 6** (Week 7, Days 43-49)
   - Agent R: Progress tracking API
   - Agent S: Streak & achievement system

10. **Phase 7** (Week 8, Days 50-56)
    - Agent T: Chapter content writing
    - Agent U: Audio recording
    - Agent V: Testing suite
    - Agent W: Performance optimization

---

## 📊 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| warcraftcn-ui components integrated | 100% | Component audit |
| All 12 chapters functional | 100% | Manual testing |
| Unlock animation <2s | <2s | Lighthouse performance |
| Biorhythm calculation accuracy | 100% | Compare against 3rd-party calculators |
| Mobile Lighthouse score | >90 | Lighthouse CI |
| Accessibility score (WCAG 2.1 AA) | 100% | Axe DevTools |
| Beta testers complete 3+ chapters | 80% | Analytics |
| 44 daily active users by Month 2 | 44 | GA4 |
| 21% complete all 12 chapters | 21% | Database query |
| Uptime | 99%+ | Cloudflare monitoring |

---

## 🔢 Power Number Integration

Throughout the build, use these numbers:
- **8**: Breath cycles, animations (8-beat rhythm), spacing
- **13**: Unlock duration (13 seconds), transformation triggers
- **19**: Solar sync, daily check-ins
- **44**: Grid system (44px base), launch cycle (44 days)
- **21**: Line height (21px), world completion
- **125**: Creative cycles (5×5×5)
- **152**: Unity bridge, progress connections

---

## ⚠️ Critical Path Tasks

These tasks MUST be completed on schedule to avoid delays:

1. **P0-S1-01 to P0-S2-07** — warcraftcn-ui integration (NEW - Before Week 1)
2. **P1-S2-01 to P1-S2-10** — Biorhythm calculator (Week 1)
3. **P3-S1-01 to P3-S1-11** — Unlock logic (Week 4)
4. **P3-S2-01 to P3-S2-09** — 13-second unlock animation (Week 4)
5. **P7-S1-05 to P7-S1-10** — Audio recording (Week 8)

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| warcraftcn-ui integration complexity | Medium | Start with core components, adapt gradually |
| Biorhythm calculation inaccurate | High | Validate against 3+ known calculators |
| Audio recording delays | Medium | Use placeholder audio, record in parallel |
| Unlock logic too complex | Medium | Start simple (peak detection only), iterate |
| User engagement low | High | Beta test early (Day 50-52), gather feedback |
| NextAuth + JWT integration issues | Medium | Follow ADR-004, test early |
| Cloudflare Workers rate limits | Low | Monitor usage, add caching layer |

---

## 📝 Assumptions

1. warcraftcn-ui components can be adapted to wellness theme
2. Birth date + timezone are sufficient for biorhythm calculation
3. Sunrise/sunset data available via external API (e.g., sunrise-sunset.org)
4. Audio files are pre-recorded (or placeholder audio used initially)
5. User completes chapters sequentially (no skipping)
6. Cloudflare free tier is sufficient for beta (13 users)

---

## 🎯 Next Actions

1. **Review this plan** — Confirm warcraftcn-ui integration approach
2. **Start Phase 0** — Begin warcraftcn-ui component extraction (P0-S1-01)
3. **Dispatch parallel agents** — Start P0 with 2 agents (Components, Design System)
4. **Daily standups** — Track progress, unblock agents, adjust plan

---

**⚠️ REMEMBER: NOTHING IS DONE. WE ARE STARTING FRESH.**

Previous work archived in memory.md under "Previous Attempt (2026-02-03 to 2026-02-07)"

---

**Ready to build with warcraftcn-ui?** Let me know if you want to:
- Adjust warcraftcn-ui integration approach
- Add/remove tasks
- Change parallel dispatch strategy
- Start implementation now

*"Every task is an octave, every commit a transformation."*
