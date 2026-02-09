# 🌊 Somatic Canticles

[![Version](https://img.shields.io/badge/version-1.0.0--beta-blue.svg)](https://github.com/yourusername/somatic-canticles)
[![Status](https://img.shields.io/badge/status-beta-orange.svg)](https://github.com/yourusername/somatic-canticles)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)](https://workers.cloudflare.com/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-f472b6?logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[![Biorhythm](https://img.shields.io/badge/Biorhythm-4--cycle-purple)](https://en.wikipedia.org/wiki/Biorhythm)
[![Chapters](https://img.shields.io/badge/Chapters-12-gold)](.)
[![Audio](https://img.shields.io/badge/Audio-143min-pink)](.)
[![Tests](https://img.shields.io/badge/Tests-51%20passed-brightgreen)](.)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-98.1-blueviolet)](.docs/PERFORMANCE_REPORT.md)

> **A consciousness evolution manual disguised as a biorhythm-synchronized webapp.**

Embark on a 12-chapter journey through your physical, emotional, intellectual, and spiritual cycles. Each chapter unlocks based on your personal biorhythm, guiding you through embodied practices inspired by the *Somatic Canticles* trilogy.

🔗 **Live Demo:** [https://somatic-canticles.pages.dev](https://somatic-canticles.pages.dev)  
📖 **Documentation:** [`.docs/`](.docs/)  
🎨 **Design System:** [warcraftcn-ui](https://github.com/TheOrcDev/warcraftcn-ui)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌙 **Biorhythm Engine** | 4-cycle calculator (Physical 23d, Emotional 28d, Intellectual 33d, Spiritual 21d) |
| 📖 **12 Chapters** | Progressive unlocking based on your biorhythm cycles |
| 🎵 **13 Canticles** | Guided audio meditations (~143 minutes total) |
| 🎨 **Warcraftcn UI** | Retro RTS aesthetic with wellness theme |
| 🔐 **Secure Auth** | NextAuth.js + JWT with Argon2id hashing |
| ⚡ **Edge Deployed** | Cloudflare Workers + D1 database |
| 📊 **Progress Tracking** | Streaks, achievements, completion metrics |
| 🎭 **13s Unlock Animation** | Cinematic 5-phase transformation sequence |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/somatic-canticles.git
cd somatic-canticles

# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your secrets (see below)

# Set up database
cd workers
bun run db:create
bun run db:migrate
bun run db:seed
cd ..

# Start development
bun run dev                 # Frontend: http://localhost:3000
cd workers && bun run dev   # API: http://localhost:8787
```

### Default Credentials (Development)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@somatic-canticles.local` | `SomaticDev44!` |
| User | `test@example.com` | `TestUser13!` |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Runtime:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Library:** [warcraftcn-ui](https://github.com/TheOrcDev/warcraftcn-ui)
- **Forms:** React Hook Form + Zod
- **Auth:** [NextAuth.js v5](https://authjs.dev/)

### Backend
- **Platform:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **Framework:** [Hono](https://hono.dev/) v4
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **Auth:** JWT (custom implementation)
- **Validation:** Zod

### DevOps
- **Package Manager:** [Bun](https://bun.sh/)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry + Cloudflare Analytics
- **Testing:** Playwright (E2E) + Vitest (Unit)

---

## 📁 Project Structure

```
somatic-canticles/
├── 📱 app/                      # Next.js 16 App Router
│   ├── (auth)/                 # Auth routes (login, register)
│   ├── (dashboard)/            # Protected dashboard routes
│   ├── api/                    # API routes
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Landing page
│
├── 🧩 src/
│   ├── components/             # React components
│   │   ├── ui/                 # warcraftcn-ui components
│   │   ├── biorhythm/          # Biorhythm visualizations
│   │   ├── chapters/           # Chapter cards & content
│   │   └── auth/               # Auth components
│   ├── lib/
│   │   ├── lore/               # Trilogy content & canticle scripts
│   │   ├── auth/               # Auth utilities
│   │   ├── biorhythm/          # Calculation engine
│   │   └── utils/              # Helper functions
│   └── types/                  # TypeScript definitions
│
├── ⚡ workers/                  # Cloudflare Workers API
│   ├── api/                    # Hono routes
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── biorhythm.ts        # Biorhythm calculations
│   │   └── chapters.ts         # Chapter management
│   ├── migrations/             # D1 database migrations
│   ├── scripts/                # Seed & utility scripts
│   └── wrangler.toml           # Workers config
│
├── 📚 content/                  # Static content
│   └── audio-scripts/          # Canticle scripts for recording
│
├── 🎨 public/                   # Static assets
│   ├── canticles/              # Audio files
│   └── icons/                  # Chapter icons
│
├── 📖 .docs/                    # Project documentation
│   ├── 00-Project-Hub/         # Vision & roadmap
│   ├── 01-Planning/            # Sprints & kanban
│   ├── 02-Design/              # Visual design
│   ├── 03-Development/         # Technical docs
│   └── 04-Content/             # Content strategy
│
├── 🔧 .context/                 # AI context (development)
├── 🧪 e2e/                      # Playwright tests
└── 📄 config files...
```

---

## 📚 Documentation

| Topic | Location | Description |
|-------|----------|-------------|
| 📋 [Project Hub](.docs/00-Project-Hub/) | Vision, roadmap, success criteria |
| 🎯 [Planning](.docs/01-Planning/) | Sprints, kanban, task waves |
| 🎨 [Design](.docs/02-Design/) | Visual design, UI patterns |
| 💻 [Development](.docs/03-Development/) | Architecture, API contracts |
| 📖 [Content](.docs/04-Content/) | Chapter content, canticle scripts |
| 🔐 [Auth Reference](.context/AUTH_QUICK_REF.md) | Auth system quick reference |
| 🌊 [Biorhythm Engine](.context/biorhythm/) | Calculation docs |
| 📊 [Performance Report](.docs/PERFORMANCE_REPORT.md) | Lighthouse scores |

---

## 🎮 The 12 Chapters

| # | Chapter | Cycle | Duration | Key Practice |
|---|---------|-------|----------|--------------|
| 1 | The Choroid Plexus | Physical | 16 min | CSF Flow Awareness |
| 2 | Signal Transduction | Physical | 18 min | Signal Recognition |
| 3 | Blood-Brain Barrier | Physical | 20 min | Boundary Awareness |
| 4 | The Endocrine Dogma | Emotional | 22 min | Hormonal Awareness |
| 5 | Synaptic Crossroads | Emotional | 24 min | Crossroads Meditation |
| 6 | Compass Calibration | Emotional | 26 min | Compass Calibration |
| 7 | The Sigil Smith | Intellectual | 20 min | Sigil Creation |
| 8 | Debug Protocol | Intellectual | 22 min | Consciousness Debugging |
| 9 | Myocardial Chorus | Intellectual | 24 min | Heart Resonance |
| 10 | Witness Integration | Spiritual | 26 min | Witness Integration |
| 11 | Synthesis Protocol | Spiritual | 28 min | Four-Element Synthesis |
| 12 | The New Beginning | Spiritual | 30 min | Architecture Design |

**Source:** [Somatic Canticles Trilogy](.context/MANUSCRIPT_INTEGRATION_COMPLETE.md) - 27 manuscript chapters mapped to 12 webapp chapters.

---

## 🔢 Sacred Geometry

This project uses power numbers throughout:

| Number | Meaning | Usage |
|--------|---------|-------|
| **8** | Breath cycles | Animation timing |
| **13** | Transformation | Unlock duration (13s) |
| **19** | Solar sync | Daily check-ins |
| **21** | Completion | Line height, world building |
| **23** | Physical cycle | Biorhythm (days) |
| **28** | Emotional cycle | Biorhythm (days) |
| **33** | Intellectual | Biorhythm (days) |
| **44** | Structure | Grid base |

---

## 🧪 Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Lighthouse CI
bun run lighthouse
```

| Metric | Score |
|--------|-------|
| Performance | 98.1 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## 🚀 Deployment

### Automatic (CI/CD)

Push to `main` triggers:
1. ✅ Lint & type check
2. ✅ Build application
3. ✅ Run tests
4. ✅ Deploy to Cloudflare Pages (frontend)
5. ✅ Deploy to Cloudflare Workers (API)
6. ✅ Run database migrations

### Manual

```bash
# Deploy Workers API
cd workers && bun run deploy:prod

# Deploy Frontend (Cloudflare Pages)
# Connect GitHub repo to Cloudflare Pages
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The *Somatic Canticles* trilogy content is © 2026 and used with permission.

---

## 🙏 Acknowledgments

- **warcraftcn-ui** - For the stunning RTS-inspired UI components
- **Cloudflare** - For the edge computing platform
- **Vercel/Next.js Team** - For the incredible React framework
- **Bun** - For the fast JavaScript runtime

---

## 🔗 Links

- 🌐 [Live Demo](https://somatic-canticles.pages.dev)
- 📖 [Documentation](.docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/somatic-canticles/issues)
- 💬 [Discussions](https://github.com/yourusername/somatic-canticles/discussions)

---

<p align="center">
  <i>"Every task is an octave, every commit a transformation."</i><br>
  <sub>Built with 🖤 and sacred geometry</sub>
</p>
