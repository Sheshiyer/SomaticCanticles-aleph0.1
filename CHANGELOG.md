# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta] - 2026-02-09

### 🎉 Initial Beta Release

After 2 waves of development (80 tasks), the Somatic Canticles webapp is ready for beta testing.

### ✨ Added

#### Core Features
- **Biorhythm Engine** - 4-cycle calculator (Physical 23d, Emotional 28d, Intellectual 33d, Spiritual 21d)
- **12 Chapters** - Progressive unlocking based on biorhythm cycles
- **13 Canticles** - Guided audio meditations (~143 minutes total)
- **13-Second Unlock Animation** - Cinematic 5-phase transformation sequence
- **Progress Tracking** - Streaks, achievements, completion metrics

#### Authentication & Security
- NextAuth.js v5 with credentials + OAuth (Google, GitHub)
- JWT authentication with Argon2id password hashing
- Protected routes with middleware
- Rate limiting on auth endpoints

#### UI/UX
- Warcraftcn-ui integration (retro RTS aesthetic)
- LightPillar effects and animations
- Biorhythm wheel visualization
- 30-day forecast chart
- Responsive design (mobile-first)

#### Content
- **Manuscript Integration** - 27 trilogy chapters mapped to 12 webapp chapters
- **Story Context** - Excerpts from the Somatic Canticles trilogy
- **Practice Instructions** - 12 embodied practices (8-15 min each)
- **Reflection Prompts** - 48 journaling questions
- **Canticle Scripts** - Complete audio scripts ready for recording

#### Technical
- Next.js 16 with App Router
- React 19 and TypeScript 5
- Cloudflare Workers + D1 database
- Tailwind CSS 4 with custom power-number utilities
- Hono v4 for API routes
- Sentry error tracking
- Google Analytics 4

#### Testing
- 51 unit tests for biorhythm calculations
- Playwright E2E tests for critical flows
- Lighthouse CI with 98.1 performance score
- WCAG 2.1 AA accessibility audit

### 📊 Stats

- **Documentation:** 60+ pages

### 🙏 Contributors

- Development Team - Architecture and implementation
- Content Team - Manuscript integration and canticle scripts
- Design Team - UI/UX and warcraftcn-ui adaptation

---

## [1.0.0] - 2026-02-14

### 🚀 Stable Release

The *Somatic Canticles* project has reached its stable milestone, integrating the core web experience with the Discord-based "Somatic Oracle" and a complete achievements system.

### ✨ New Features

#### 🔮 The Somatic Oracle (Discord Integration)
- **Daily Sunrise Protocol** - Automated DM dispatch of biorhythm insights at 6 AM UTC.
- **Slash Commands** - `/codex` for codon lookup, `/calibrate` for account linking, `/status` for instant checks.
- **Role Sync** - "Neophyte" role auto-assigned upon linking via the `/calibrate` OTP flow.
- **Ed25519 Security** - Cryptographic verification for all Discord interactions.

#### 🥚 Easter Eggs & Secrets
- **The Tryambakam Acrostic** - Hidden message in Chapter 21-27 titles ("CONNECT").
- **The Binary Heartbeat** - Interactive terminal sequence in Chapter 13 (`BINARY` command).
- **The Glitch** - Subtle visual anomalies triggered by specific user interactions.

#### 🏆 Progression System
- **Achievements Dashboard** - Track 8 detailed milestones (Streak, Cycle Master, etc.).
- **Rarity Tiering** - Common, Rare, Epic, and Legendary achievements.
- **Dynamic Unlock Logic** - Real-time tracking of chapter completion and streak data.

#### 📚 Lore System
- **Supabase Integration** - Migrated static JSON lore to a scalable Postgres database.
- **Admin Tools** - Dashboard for content management and user oversight.

### 🐛 Bug Fixes
- Resolved `NaN%` display issue on empty Achievements page.
- Fixed `Failed to load` errors for users with no history.
- Corrected "Congratulations" message triggering prematurely.
- Stabilized `AchievementCard` rendering logic.

### 🔒 Security
- **RPDA (Remote Personality Dispatch Architecture)** - Secure, serverless function architecture for all Discord interactions.
- **OTP Verification** - Time-based one-time password flow for linking Discord and Web accounts.

---

## [Unreleased]

### Planned for v1.0.0

- [ ] Canticle audio recording (12 tracks)
- [ ] Push notifications for chapter unlocks
- [ ] Social features (sharing progress)
- [ ] Mobile app (React Native)
- [ ] Additional languages (i18n)
- [ ] Advanced analytics dashboard

### Known Issues

- Audio player uses placeholder tracks (Week 8 deliverable)
- Chapter 12 requires 3-day spiritual peak (rare unlock condition)
- Some animations may lag on older mobile devices

---

## Release History

| Version | Date | Status |
|---------|------|--------|
| 1.0.0-beta | 2026-02-09 | Beta Release |
| 1.0.0 | 2026-02-14 | **Stable Release** |

---

## Legend

- 🎉 - Major feature
- ✨ - New feature
- 🐛 - Bug fix
- 📝 - Documentation
- ♻️ - Refactoring
- ⚡ - Performance
- 🔒 - Security
