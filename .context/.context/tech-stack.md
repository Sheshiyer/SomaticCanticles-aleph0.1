# Tech Stack

Canonical stack for Somatic-Canticles Webapp. Use these choices unless an ADR or explicit approval overrides them.

## Backend: Cloudflare Only

The backend is **Cloudflare-only** for the current scope (fairly simple). Use:

- **Cloudflare Workers** for serverless API and server-side logic
- **Cloudflare D1** (SQLite at the edge) for persistence when needed
- **Cloudflare R2** for audio and static assets
- **Cloudflare Pages** or **Workers** for deployment

No separate Node/Python/Go server. Keep logic on the edge; use Workers + D1 (+ R2) as the single backend surface. Document any Workers API shape in `.context/api/endpoints.md` and env in `.context/env.md`.

## Package Manager: Bun

- **Bun** is the package manager and runtime for tooling and local scripts.
- Use `bun install`, `bun run`, `bun test`, etc. Do not add npm or pnpm as primary package manager.
- Lockfile: `bun.lockb`. CI and local commands assume Bun.

## Frontend Components: React Bits MCP

- **React Bits (React Bits.dev MCP)** is the source of truth for UI components.
- **Workflow:** Use the React Bits MCP (list_categories, list_components, search_components, get_component, get_component_demo) to discover and pull components. Prefer **Tailwind**-based components when available.
- **When a component does not exist in React Bits:** Be inspired by React Bits patterns (Animations, Backgrounds, Text Animations, Buttons, Forms, Loaders, etc.) and implement a matching component in the same style (Tailwind, Framer Motion where appropriate). Do not introduce a different component library as the primary source; extend the ecosystem in a React-Bits–inspired way.
- Component design and token usage: see `.context/ui/component-ecosystem.md` and `.context/ui/overview.md`.

## Summary

| Layer | Choice | Note |
|-------|--------|------|
| Backend | Cloudflare (Workers, D1, R2) | Single backend; no separate server |
| Package manager | Bun | Install, run, test, lockfile |
| UI components | React Bits MCP | Use or emulate; Tailwind; Framer Motion where used by React Bits |
