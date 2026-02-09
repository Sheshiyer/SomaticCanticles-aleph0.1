# UI: Component Architecture Overview

**⚠️ FRESH START (2026-02-09):** This document is being updated to use warcraftcn-ui as our UI foundation. All previous component architecture is archived for reference only.

**UI Foundation:** [warcraftcn-ui](https://github.com/TheOrcDev/warcraftcn-ui) — Warcraft-themed retro UI components  
**Integration Guide:** [./warcraftcn-ui-integration.md](./warcraftcn-ui-integration.md)

---

This document defines the frontend component architecture, design system foundations, and UI patterns for Somatic-Canticles Webapp.

## UI Foundation: warcraftcn-ui

We are using [warcraftcn-ui](https://github.com/TheOrcDev/warcraftcn-ui) as our UI component foundation. See [warcraftcn-ui-integration.md](./warcraftcn-ui-integration.md) for detailed integration guide.

### Key Components from warcraftcn-ui

| Component | Purpose | Adaptation |
|-----------|---------|------------|
| Button | Actions | Power-number colors |
| Card | Content containers | Light pillar glow effects |
| Dialog/Modal | Overlays | Unlock animation backgrounds |
| Input | Forms | Power-number focus states |
| Light Pillar | **CRITICAL** | 13-second unlock animations |
| Theme Provider | Dark/light mode | Keep as-is |

### Integration Approach

1. **Extract** warcraftcn-ui components to `src/components/ui/`
2. **Adapt** colors to power-number palette
3. **Customize** for wellness theme (wonder, not war)
4. **Extend** with biorhythm-specific components

---

## Design Tokens (Somatic-Canticles)

Power-number palette and rhythm-based typography from `.docs/02-Design/canvas/Visual-Canvas.md`:

**Colors (CSS variables):**
- `--octave-8: #FF6B6B` (Energy, activation)
- `--transform-13: #9B59B6` (Change, alchemy)
- `--solar-19: #F1C40F` (Light, leadership)
- `--architect-44: #3498DB` (Structure, blueprint)
- `--world-21: #2ECC71` (Completion, growth)
- `--life-125: #E74C3C` (Creative force)
- `--unity-152: #1ABC9C` (Bridge, connection)

**Typography:** H1 44px (Architect), H2 21px (World), H3 19px (Solar), H4 13px (Transform). Body 16px, line height 1.618. Spacing: 8px increments.

**Unlock sequence:** 13-second animation (0–3s pulse 8-beat, 3–6s color transform, 6–9s geometric expansion, 9–12s sound wave, 12–13s reveal).

## Design System Foundation

### Design Tokens

```yaml
# tokens.yaml - Single source of truth for design values
colors:
  primary:
    50: "#eff6ff"
    500: "#3b82f6"
    900: "#1e3a8a"
  semantic:
    success: "#10b981"
    warning: "#f59e0b"
    error: "#ef4444"
    info: "#3b82f6"

spacing:
  unit: 4px
  scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]

typography:
  fontFamily:
    sans: "Inter, system-ui, sans-serif"
    mono: "JetBrains Mono, monospace"
  fontSize:
    xs: "0.75rem"    # 12px
    sm: "0.875rem"   # 14px
    base: "1rem"     # 16px
    lg: "1.125rem"   # 18px
    xl: "1.25rem"    # 20px
    2xl: "1.5rem"    # 24px
  fontWeight:
    normal: 400
    medium: 500
    semibold: 600
    bold: 700

borderRadius:
  none: "0"
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  full: "9999px"

shadows:
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"

breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
```

### Component Specification Format

Each component follows this deterministic specification:

```yaml
# component-spec.yaml
component: Button
category: actions
status: stable

props:
  variant:
    type: enum
    values: [primary, secondary, ghost, destructive]
    default: primary
    required: false
  size:
    type: enum
    values: [sm, md, lg]
    default: md
    required: false
  disabled:
    type: boolean
    default: false
  loading:
    type: boolean
    default: false
  children:
    type: ReactNode
    required: true

states:
  - default
  - hover
  - focus
  - active
  - disabled
  - loading

accessibility:
  role: button
  aria-disabled: "maps to disabled prop"
  aria-busy: "maps to loading prop"
  keyboard:
    - key: Enter
      action: trigger click
    - key: Space
      action: trigger click

tokens:
  primary:
    background: colors.primary.500
    backgroundHover: colors.primary.600
    text: colors.white
  secondary:
    background: colors.gray.100
    backgroundHover: colors.gray.200
    text: colors.gray.900
```

## Component Architecture

```
src/
├── components/
│   ├── primitives/        # Base building blocks
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Text/
│   │   └── Icon/
│   │
│   ├── compounds/         # Composed components
│   │   ├── FormField/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Dropdown/
│   │
│   ├── patterns/          # Complex UI patterns
│   │   ├── DataTable/
│   │   ├── SearchFilter/
│   │   └── Pagination/
│   │
│   └── layouts/           # Page layouts
│       ├── AppShell/
│       ├── AuthLayout/
│       └── DashboardLayout/
│
├── hooks/                 # Shared hooks
│   ├── useMediaQuery.ts
│   ├── useClickOutside.ts
│   └── useDebounce.ts
│
└── styles/
    ├── tokens.css
    ├── reset.css
    └── utilities.css
```

## Implementation Patterns

### React Component Structure

```tsx
// components/primitives/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner className="mr-2" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Vue Component Structure

```vue
<!-- components/primitives/Button/Button.vue -->
<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
});

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const variants: Record<Variant, string> = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };
  const state = props.disabled || props.loading ? 'opacity-50 pointer-events-none' : '';

  return [base, variants[props.variant], sizes[props.size], state].join(' ');
});
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <Spinner v-if="loading" class="mr-2" />
    <slot />
  </button>
</template>
```

## State Management Patterns

### Component State Hierarchy

```yaml
state_hierarchy:
  server_state:
    tool: TanStack Query / SWR
    scope: API data, cached responses
    examples:
      - user profile
      - list data
      - settings

  global_client_state:
    tool: Zustand / Redux / Pinia
    scope: Cross-component UI state
    examples:
      - authentication status
      - theme preference
      - sidebar collapsed

  local_component_state:
    tool: useState / ref
    scope: Single component
    examples:
      - form inputs
      - dropdown open
      - loading states

  url_state:
    tool: Router / URLSearchParams
    scope: Shareable state
    examples:
      - current page
      - filters
      - sort order
```

### Form Handling Pattern

```tsx
// Using React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'user', 'viewer']),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm({ onSubmit }: { onSubmit: (data: UserFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Email" error={errors.email?.message}>
        <Input {...register('email')} type="email" />
      </FormField>
      <FormField label="Name" error={errors.name?.message}>
        <Input {...register('name')} />
      </FormField>
      <FormField label="Role" error={errors.role?.message}>
        <Select {...register('role')}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="viewer">Viewer</option>
        </Select>
      </FormField>
      <Button type="submit" loading={isSubmitting}>
        Save User
      </Button>
    </form>
  );
}
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance Checklist

```yaml
accessibility_requirements:
  perceivable:
    - contrast_ratio: "4.5:1 for normal text, 3:1 for large text"
    - alt_text: "All images have descriptive alt text"
    - captions: "Videos have captions"

  operable:
    - keyboard_navigation: "All interactive elements focusable"
    - focus_visible: "Focus state clearly visible"
    - skip_links: "Skip to main content link present"
    - no_keyboard_traps: "Focus can always escape modals"

  understandable:
    - labels: "All form inputs have associated labels"
    - error_messages: "Errors identified and described in text"
    - consistent_navigation: "Navigation consistent across pages"

  robust:
    - valid_html: "No parsing errors"
    - aria_roles: "Correct ARIA roles and properties"
    - name_role_value: "All UI components have accessible names"
```

## Decision History & Trade-offs

### CSS Approach: Tailwind CSS + warcraftcn-ui
**Decision**: Use Tailwind CSS with warcraftcn-ui component base
**Rationale**:
- warcraftcn-ui provides solid accessible foundation
- Tailwind enables rapid customization
- Power-number tokens map to Tailwind config
- Light pillar effects provide unique atmosphere

**Trade-offs**:
- Need to adapt "war" aesthetic to "wonder"
- Component extraction required before building features
- Integration work upfront

### Component Library: warcraftcn-ui
**Decision**: Use warcraftcn-ui as base, customize for Somatic-Canticles
**Rationale**:
- High-quality accessible components out of the box
- Light pillar effects perfect for unlock animations
- RTS aesthetic adaptable to immersive wellness experience
- Open source - full customization freedom

**Trade-offs**:
- Adaptation required for wellness theme
- Phase 0 integration work before feature development
- Need to document customized usage patterns

---

**Next**: Review [./patterns.md](./patterns.md) for detailed component implementation patterns.
