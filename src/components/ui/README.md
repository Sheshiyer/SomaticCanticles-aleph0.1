# UI Components

This directory contains the core UI components for the Somatic Canticles application, built with React, Tailwind CSS v4, and Radix UI primitives.

## Design System

### Power-Number Color Palette

The application uses a unique color system based on power numbers:

| Token | Hex | Usage |
|-------|-----|-------|
| `--octave-8` | `#FF6B6B` | Accent, highlights |
| `--transform-13` | `#9B59B6` | Secondary actions |
| `--solar-19` | `#F1C40F` | Primary actions, focus states |
| `--architect-44` | `#3498DB` | Info states |
| `--world-21` | `#2ECC71` | Success states |
| `--life-125` | `#E74C3C` | Destructive actions |
| `--unity-152` | `#1ABC9C` | Completion, final states |

## Components

### Button

Multi-variant button component with full TypeScript support.

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

**Props:**
- `variant`: `"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"`
- `size`: `"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"`
- `asChild`: `boolean` - Use for rendering as a different element

### Card

Container component with header, content, and footer sections.

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>Main content here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

**Props:**
- `size`: `"default" | "sm"` - Controls padding and spacing

### Dialog

Modal dialog component using Radix UI Dialog primitive.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description here.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Sheet

Slide-out panel component (used for mobile navigation).

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

**Props:**
- `side`: `"top" | "right" | "bottom" | "left"`

### Form Components

#### Input

```tsx
import { Input } from "@/components/ui/Input";

<Input 
  type="text" 
  placeholder="Enter text..."
  error="Error message" // Optional error display
/>
```

#### Textarea

```tsx
import { Textarea } from "@/components/ui/Textarea";

<Textarea 
  placeholder="Enter text..."
  error="Error message"
/>
```

#### Label

```tsx
import { Label } from "@/components/ui/Label";

<Label htmlFor="email" required>Email</Label>
```

#### Select

```tsx
import { Select } from "@/components/ui/Select";

<Select
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
  placeholder="Select an option"
/>
```

### Loading Components

#### Spinner

```tsx
import { Spinner, PageLoader, ButtonLoader } from "@/components/ui/Spinner";

<Spinner size="md" variant="primary" />
<PageLoader message="Loading..." />
<ButtonLoader>Saving...</ButtonLoader>
```

#### Skeleton

```tsx
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/ui/Skeleton";

<Skeleton className="h-4 w-full" />
<SkeletonText lines={3} />
<SkeletonCard hasHeader contentLines={2} />
```

## Layout Components

### Header

Main navigation header with responsive design.

```tsx
import { Header } from "@/components/layout/Header";

<Header 
  navItems={[
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]}
  logo="My App"
/>
```

### Sidebar

Side navigation for dashboard layouts.

```tsx
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";

<Sidebar
  sections={[
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <HomeIcon /> },
        { label: "Settings", href: "/settings" },
      ],
    },
  ]}
/>
```

## Effects Components

### LightPillar

Animated light pillar effect using power-number colors.

```tsx
import { LightPillar, LightPillarGroup } from "@/components/effects/LightPillar";

<LightPillar color="solar" intensity="high" height={400} />

<LightPillarGroup 
  count={3} 
  colors={["solar", "transform", "architect"]}
  spacing={40}
/>
```

**Props:**
- `color`: `"octave" | "transform" | "solar" | "architect" | "world" | "life" | "unity"`
- `intensity`: `"low" | "medium" | "high"`
- `animate`: `boolean`
- `height`: `string | number`

## Error Handling

### ErrorBoundary

React error boundary for catching component errors.

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## Theme

The application supports dark/light mode via next-themes.

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

<ThemeToggle />
```

## Dependencies

- `class-variance-authority` - Component variant management
- `clsx` + `tailwind-merge` - Conditional class merging
- `@radix-ui/react-*` - Headless UI primitives
- `next-themes` - Theme management
- `lucide-react` - Icons
- `react-hook-form` + `zod` - Form handling
