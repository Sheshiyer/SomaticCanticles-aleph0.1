# Contributing to Somatic Canticles

First off, thank you for considering contributing to Somatic Canticles! It's people like you that make this project a tool for consciousness evolution.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to:

- **Respect** - Treat everyone with respect and dignity
- **Inclusivity** - Welcome contributors from all backgrounds
- **Collaboration** - Work together toward shared goals
- **Quality** - Strive for excellence in all contributions

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- A Cloudflare account (for D1 database)

### Setup

```bash
# Fork and clone
git clone https://github.com/yourusername/somatic-canticles.git
cd somatic-canticles

# Install dependencies
bun install
cd workers && bun install && cd ..

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
cd workers
bun run db:create
bun run db:migrate
bun run db:seed
cd ..

# Start development
bun run dev
```

## 🔄 Development Workflow

### Branch Naming

Use the following prefixes for branches:

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

Example: `feature/chapter-13-content` or `fix/auth-redirect-loop`

### Task Organization

We organize work in **Task Waves** rather than traditional sprints:

1. **Check** `.context/todo.md` or `.docs/01-Planning/` for available tasks
2. **Claim** a task by commenting on it or creating an issue
3. **Work** on your feature branch
4. **Integrate** continuously (don't wait for "sprint end")
5. **Submit** a pull request

## 📁 Project Structure

```
somatic-canticles/
├── app/              # Next.js App Router
├── src/              # Source code
│   ├── components/   # React components
│   └── lib/          # Utilities & lore
├── workers/          # Cloudflare Workers API
├── e2e/              # Playwright tests
└── .docs/            # Documentation
```

Key directories:
- `src/lib/lore/` - Chapter content & canticle scripts
- `workers/api/` - API routes (Hono)
- `workers/migrations/` - Database migrations
- `.context/` - AI context & technical docs

## 🎨 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` - use `unknown` with type guards
- Export types from `src/types/`

### React Components

```typescript
// Use functional components with hooks
interface ChapterCardProps {
  chapter: Chapter;
  isUnlocked: boolean;
}

export function ChapterCard({ chapter, isUnlocked }: ChapterCardProps) {
  // Component logic
}
```

### Styling (Tailwind)

- Use Tailwind CSS utility classes
- Follow the project's color theme (ember, ocean, solar, lunar)
- Use power numbers for spacing when meaningful (8, 13, 21)
- Component-specific styles in `globals.css`

### API Routes (Workers)

```typescript
// Use Hono with Zod validation
app.post('/api/chapters/:id/complete', zValidator('json', completeSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.req.valid('json');
  // Implementation
});
```

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

Examples:
```
feat(chapters): add unlock animation for chapter cards
fix(auth): resolve JWT expiration handling
docs(readme): update deployment instructions
```

## 🔀 Pull Request Process

1. **Update** documentation for any changed functionality
2. **Add** tests for new features
3. **Ensure** all tests pass (`bun run test`)
4. **Update** `.context/memory.md` with any new error patterns
5. **Fill out** the PR template completely
6. **Request** review from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** - What happened?
2. **Steps to Reproduce** - How can we replicate it?
3. **Expected Behavior** - What should have happened?
4. **Screenshots** - If applicable
5. **Environment**:
   - OS: [e.g., macOS 14.0]
   - Browser: [e.g., Chrome 120]
   - Node/Bun version

Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)

## 💡 Suggesting Features

We love new ideas! For feature requests:

1. Check existing issues first
2. Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Explain the use case
4. Describe expected behavior
5. Consider implementation approach

## 🧪 Testing Guidelines

### Unit Tests

```bash
bun run test
```

- Test utilities and hooks
- Mock external dependencies
- Aim for >80% coverage

### E2E Tests

```bash
bun run test:e2e
```

- Test critical user flows
- Auth flows
- Chapter unlocking
- Biorhythm calculations

### Manual Testing Checklist

- [ ] Application loads without errors
- [ ] Auth flows work (login, register, logout)
- [ ] Biorhythm chart renders correctly
- [ ] Chapter cards display properly
- [ ] Unlock animation plays smoothly
- [ ] Audio player functions
- [ ] Mobile responsiveness

## 📚 Documentation

- Update README.md for user-facing changes
- Update `.docs/` for architectural decisions
- Update `.context/` for AI context
- Add JSDoc comments for complex functions

## 🏷️ Versioning

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes

## 💬 Questions?

- Open a [Discussion](https://github.com/yourusername/somatic-canticles/discussions)
- Join our Discord (coming soon)
- Email: contributors@somatic-canticles.local

---

Thank you for contributing to consciousness evolution through code! 🙏
