# warcraftcn-ui Integration Guide

**Repository:** https://github.com/TheOrcDev/warcraftcn-ui  
**Status:** UI Foundation for Somatic-Canticles Webapp  
**Integration Date:** 2026-02-09 (Fresh Start)

---

## Overview

warcraftcn-ui is a collection of accessible, retro-inspired UI components drawing from classic real-time strategy aesthetics. We're using it as the foundation for our Somatic-Canticles Webapp UI.

### Why warcraftcn-ui?

| Feature | Benefit |
|---------|---------|
| **RTS Aesthetic** | Immersive, atmospheric UI perfect for consciousness practice app |
| **Light Pillar Effects** | Perfect for 13-second unlock animations |
| **Accessibility** | ARIA-compliant components out of the box |
| **Modern Stack** | Built for Next.js 14, React, TypeScript |
| **Open Source** | Copy, paste, customize freely |

---

## Integration Strategy

### Phase 0: Foundation (Before Building Features)

**DO NOT** build app features until warcraftcn-ui integration is complete.

1. **Extract** - Clone and study warcraftcn-ui structure
2. **Adapt** - Merge with power-number design system
3. **Customize** - Soften "war" aesthetic to "wonder"
4. **Document** - Create component usage guide
5. **Build** - Use adapted components for all features

### Aesthetic Transformation

| From (warcraftcn-ui) | To (Somatic-Canticles) |
|---------------------|------------------------|
| War/RTS theme | Wonder/Consciousness theme |
| Aggressive edges | Soft, flowing forms |
| Battle colors | Power-number colors |
| Combat icons | Spiritual symbols |
| Keep: Light pillars, atmospheric effects, animations |

---

## Component Inventory

### Core Components (Extract First)

| Component | Location | Adaptation Needed |
|-----------|----------|-------------------|
| Button | `components/ui/` | Colors → power-number palette |
| Card | `components/ui/` | Add glow effects |
| Modal/Dialog | `components/ui/` | Light pillar background |
| Input | `components/ui/` | Power-number focus states |
| Select | `components/ui/` | Custom dropdown styling |
| Textarea | `components/ui/` | Match input styling |
| Spinner/Loader | `components/ui/` | 8-beat animation |
| Tooltip | `components/ui/` | Subtle, elegant |

### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Site Header | `components/site-header.tsx` | Main navigation |
| Sidebar | `components/docs-sidebar.tsx` | Chapter navigation |
| Footer | `components/site-footer.tsx` | App footer |
| Mobile Nav | `components/mobile-nav.tsx` | Responsive menu |

### Special Effects

| Component | Location | Purpose |
|-----------|----------|---------|
| Light Pillar | `components/light-pillar.tsx` | **CRITICAL** - Unlock animations |
| Theme Provider | `components/theme-provider.tsx` | Dark/light mode |
| Mode Switcher | `components/mode-switcher.tsx` | Theme toggle |

---

## Color System Integration

### warcraftcn-ui Colors

```css
/* From warcraftcn-ui app/global.css */
--background: 20 14.3% 4.1%;
--foreground: 0 0% 95%;
--card: 24 9.8% 10%;
--card-foreground: 0 0% 95%;
--popover: 0 0% 9%;
--popover-foreground: 0 0% 95%;
--primary: 142.1 70.6% 45.3%;
--primary-foreground: 144.9 80.4% 10%;
--secondary: 240 3.7% 15.9%;
--secondary-foreground: 0 0% 98%;
--muted: 0 0% 15%;
--muted-foreground: 240 5% 64.9%;
--accent: 12 6.5% 15.1%;
--accent-foreground: 0 0% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 0 0% 98%;
--border: 240 3.7% 15.9%;
--input: 240 3.7% 15.9%;
--ring: 142.4 71.8% 29.2%;
```

### Power-Number Colors (Merge)

```css
/* Somatic-Canticles power numbers */
--octave-8: #FF6B6B;      /* Energy, activation */
--transform-13: #9B59B6;  /* Change, alchemy */
--solar-19: #F1C40F;      /* Light, leadership */
--architect-44: #3498DB;  /* Structure, blueprint */
--world-21: #2ECC71;      /* Completion, growth */
--life-125: #E74C3C;      /* Creative force */
--unity-152: #1ABC9C;     /* Bridge, connection */
```

### Merged Color Scheme

```css
/* Use warcraftcn-ui structure with power-number accents */
--primary: var(--solar-19);        /* Solar as primary */
--secondary: var(--transform-13);  /* Transform as secondary */
--accent: var(--octave-8);         /* Octave for accents */
--success: var(--world-21);        /* World for success */
--destructive: var(--life-125);    /* Life for destructive */
```

---

## Light Pillar Integration

**CRITICAL COMPONENT** for unlock animations.

### Usage in Unlock Sequence

```tsx
// 13-second unlock animation with light pillars
<LightPillar 
  intensity={unlockProgress}  // 0-1 based on animation phase
  color={chapterColor}        // Power-number color for chapter
  pulse={true}                // 8-beat rhythm
/>
```

### Animation Phases

| Phase | Time | Light Pillar Effect |
|-------|------|---------------------|
| Pulse | 0-3s | Gentle glow, 8-beat rhythm |
| Transform | 3-6s | Color shift to chapter color |
| Expand | 6-9s | Height increases, mandala appears |
| Wave | 9-12s | Sound wave visualization |
| Reveal | 12-13s | Peak brightness, chapter appears |

---

## Typography Integration

### warcraftcn-ui Typography

- Uses system font stack
- Clean, readable at all sizes

### Power-Number Typography (Merge)

```css
/* Keep warcraftcn-ui base, add power-number display sizes */
--text-architect: 44px;  /* H1 - Major titles */
--text-world: 21px;      /* H2 - Section headers */
--text-solar: 19px;      /* H3 - Subsections */
--text-transform: 13px;  /* H4 - Small headers */
--line-height-golden: 1.618;
```

---

## Implementation Checklist

### Phase 0.1: UI Foundation Setup

- [ ] **P0-S1-01** Clone warcraftcn-ui repository
- [ ] **P0-S1-02** Map components to project needs
- [ ] **P0-S1-03** Extract core components (Button, Card, Modal)
- [ ] **P0-S1-04** Adapt color system to power-numbers
- [ ] **P0-S1-05** Integrate light-pillar effects
- [ ] **P0-S1-06** Set up Storybook documentation
- [ ] **P0-S1-07** Create integration guide

### Phase 0.2: Design System Migration

- [ ] **P0-S2-01** Migrate design tokens
- [ ] **P0-S2-02** Build biorhythm components
- [ ] **P0-S2-03** Create chapter cards
- [ ] **P0-S2-04** Design unlock animations
- [ ] **P0-S2-05** Build audio player
- [ ] **P0-S2-06** Create navigation
- [ ] **P0-S2-07** Implement theming

---

## Component Usage Examples

### Button with Power-Number Colors

```tsx
import { Button } from '@/components/ui/button';

// Primary - Solar (activation)
<Button variant="primary">Begin Practice</Button>

// Secondary - Transform (change)
<Button variant="secondary">View Progress</Button>

// Ghost - subtle
<Button variant="ghost">Cancel</Button>

// With loading state (8-beat animation)
<Button loading>Calculating...</Button>
```

### Card with Light Pillar Background

```tsx
import { Card } from '@/components/ui/card';
import { LightPillar } from '@/components/light-pillar';

<Card className="relative overflow-hidden">
  <LightPillar 
    className="absolute inset-0 opacity-20" 
    color="--solar-19"
  />
  <CardContent className="relative z-10">
    <h3>Chapter 1: The Body Remembers</h3>
  </CardContent>
</Card>
```

### Modal for Unlock Sequence

```tsx
import { Modal } from '@/components/ui/modal';
import { LightPillar } from '@/components/light-pillar';

<Modal 
  isOpen={unlocking}
  className="bg-transparent border-none"
>
  <LightPillar intensity={progress} color={chapterColor} />
  <UnlockAnimation progress={progress} />
</Modal>
```

---

## Accessibility Considerations

warcraftcn-ui provides good accessibility baseline:

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader announcements

### Additional Requirements

- [ ] Reduced motion support for animations
- [ ] High contrast mode
- [ ] Focus indicators for all interactive elements
- [ ] Alt text for all images
- [ ] Semantic HTML structure

---

## Dependencies

### From warcraftcn-ui

```json
{
  "dependencies": {
    "framer-motion": "^12.x",
    "lucide-react": "^0.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

### Additional for Somatic-Canticles

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-dropdown-menu": "^2.x",
    "@radix-ui/react-tooltip": "^1.x"
  }
}
```

---

## File Structure

```
src/
├── components/
│   ├── ui/                    # warcraftcn-ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── spinner.tsx
│   │   └── tooltip.tsx
│   ├── effects/               # Atmospheric effects
│   │   ├── light-pillar.tsx
│   │   └── glow.tsx
│   ├── layout/                # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── biorhythm/             # Biorhythm-specific
│   │   ├── cycle-wheel.tsx
│   │   ├── peak-indicator.tsx
│   │   └── forecast-chart.tsx
│   ├── chapters/              # Chapter-specific
│   │   ├── chapter-card.tsx
│   │   ├── unlock-animation.tsx
│   │   └── progress-ring.tsx
│   └── audio/                 # Audio components
│       ├── player.tsx
│       ├── waveform.tsx
│       └── controls.tsx
├── lib/
│   └── utils.ts               # cn() utility from warcraftcn-ui
├── styles/
│   ├── globals.css            # warcraftcn-ui + custom
│   └── tokens.css             # Power-number tokens
└── app/
    └── layout.tsx             # Theme provider setup
```

---

## Next Steps

1. **Start Phase 0.1** - Clone warcraftcn-ui (P0-S1-01)
2. **Extract Components** - Core UI first (P0-S1-03)
3. **Adapt Colors** - Merge with power-numbers (P0-S1-04)
4. **Test Light Pillars** - Critical for unlock animations (P0-S1-05)
5. **Document** - Create usage examples (P0-S1-07)

---

## References

- [warcraftcn-ui Repository](https://github.com/TheOrcDev/warcraftcn-ui)
- [Visual-Canvas.md](../../../.docs/02-Design/canvas/Visual-Canvas.md)
- [Power Numbers Guide](../../../.docs/00-Project-Hub/README.md)

---

**REMEMBER:** Complete Phase 0 before building any app features. The UI foundation must be solid first.
