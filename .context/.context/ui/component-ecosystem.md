# Component Ecosystem & Design Token System

This document defines the Somatic-Canticles design-token system (Figma-style), the component ecosystem, how components interact, and the pages and interaction patterns required across the app. Use it with React Bits MCP: prefer components from React Bits (list_components, search_components, get_component); when none exist, build components inspired by React Bits (Animations, Backgrounds, Buttons, Forms, Loaders, Text Animations) and this token system.

---

## 1. Design Tokens (Figma-Style System)

Tokens are the single source of truth for visual consistency. Implement as CSS variables and/or Tailwind theme; mirror in Figma for design-dev parity.

### 1.1 Color Tokens

Power-number palette. Use semantic names in code; hex is reference.

```css
:root {
  /* Primary power-number palette */
  --octave-8: #FF6B6B;       /* Energy, activation, primary CTA */
  --transform-13: #9B59B6;   /* Change, alchemy, secondary actions */
  --solar-19: #F1C40F;       /* Light, leadership, highlights */
  --architect-44: #3498DB;   /* Structure, blueprint, links */
  --world-21: #2ECC71;       /* Completion, growth, success */
  --life-125: #E74C3C;      /* Creative force, urgency */
  --unity-152: #1ABC9C;     /* Bridge, connection, progress */

  /* Semantic mappings */
  --color-primary: var(--architect-44);
  --color-success: var(--world-21);
  --color-warning: var(--solar-19);
  --color-error: var(--life-125);
  --color-surface: #0f0f12;
  --color-surface-elevated: #1a1a1f;
  --color-text: #f5f5f7;
  --color-text-muted: #a1a1aa;
}
```

Gradients for key moments (e.g. unlock): Morning Activation (8→19), Transformation (13→44), Completion (21→152). Define as token names so one change updates everywhere.

### 1.2 Typography Tokens

Rhythm-based scale; power numbers drive sizes.

| Token | Size | Use |
|-------|------|-----|
| `--font-h1` | 44px | Chapter titles, hero |
| `--font-h2` | 21px | Section headers |
| `--font-h3` | 19px | Subsections |
| `--font-h4` | 13px | Callouts, labels |
| `--font-body` | 16px | Body copy |
| `--font-caption` | 13px | Captions, meta |
| `--line-height-body` | 1.618 | Golden ratio |
| `--font-sans` | System UI or chosen sans | Primary font |
| `--font-mono` | Monospace | Data, code |

### 1.3 Spacing & Layout Tokens

Base unit 8px (octave). Scale: 0, 8, 16, 24, 32, 44, 48, 64, 96, 128.

```css
:root {
  --space-unit: 8px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 44px;   /* Architect */
  --space-6: 48px;
  --space-8: 64px;
  --space-12: 96px;
  --space-16: 128px;
  --radius-sm: 8px;
  --radius-md: 13px;
  --radius-lg: 21px;
  --grid-base: 44px; /* Architect grid */
}
```

### 1.4 Motion Tokens

Unlock sequence is 13 seconds; UI transitions shorter.

| Token | Value | Use |
|-------|--------|-----|
| `--duration-unlock` | 13s | Full chapter unlock |
| `--duration-transition` | 300ms | Page/panel transitions |
| `--duration-micro` | 150ms | Hover, focus |
| `--ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | Standard easing |
| `--ease-out-strong` | cubic-bezier(0, 0, 0.2, 1) | Entrances |

### 1.5 Breakpoints

Desktop 1440px+; tablet 768–1439px; mobile &lt;768px; watch/audio-only &lt;400px. Use container queries where layout depends on component width.

---

## 2. Component Hierarchy & React Bits Mapping

### 2.1 Primitives (Base Building Blocks)

- **Button**: Primary (octave-8/architect-44), secondary (transform-13), ghost. Use React Bits Buttons category; if none, build with Tailwind + power-number colors.
- **Input, Select, Checkbox, Radio**: Forms category in React Bits; validate with same tokens (border-radius, focus ring color).
- **Text**: Headings and body use typography tokens; for animated text use React Bits Text Animations (Count Up, Blur Text, etc.).
- **Icon**: Consistent size scale (13, 19, 21px); use one icon set.

### 2.2 Compounds (Composed Components)

- **Card**: Surface + radius + padding; optional Glare Hover or Star Border (React Bits Animations) for chapter cards.
- **Modal / Dialog**: Overlay + panel; 13s not for modals—use 300ms. Trap focus; close on overlay click or Escape.
- **Toast / Status message**: Fixed position (e.g. bottom-right); auto-dismiss or action; use success/warning/error semantic colors.
- **Progress bar**: Fill color from tokens (e.g. world-21 for completion); 8px height; optional gradient for “streak” feel.
- **Biorhythm bar**: One bar per cycle (physical, emotional, intellectual, spiritual); label + percentage + optional icon; same bar primitive.

### 2.3 Patterns (Page-Level Compositions)

- **Biorhythm dashboard**: Four Biorhythm bars + optional small chart; “View Chapter Map” CTA. Background: consider React Bits Aurora or Beams with low opacity.
- **Chapter card**: Locked vs unlocked state; thumbnail or placeholder; title (h3); metadata (canticle length, cycle); actions (Enter, Preview). Unlock uses 13s sequence (custom or inspired by React Bits Pixel Transition / Fade Content).
- **Chapter map**: Grid or list of chapter cards; filter by cycle; progress indicator (e.g. 7/12).
- **Unlock overlay**: Full-screen or large modal; 13-second animation phases (pulse, color, geometry, sound wave, reveal); skip optional for a11y.

### 2.4 React Bits Usage Rules

- **Animations**: Fade Content, Animated Content for entrances; Glare Hover / Sticker Peel for cards; Click Spark for primary CTAs if desired.
- **Backgrounds**: Aurora, Beams, Particles, Waves, Dot Grid for landing and dashboard; keep contrast safe for text.
- **Text Animations**: Count Up for streak count, chapter count; Blur Text or similar for hero line.
- **Loaders**: Use React Bits Loaders for data loading; style with power-number colors.
- **Forms**: React Bits Forms for inputs; wire to same tokens.
- When a component type does not exist in React Bits (e.g. a custom “BiorhythmBar”), build it using these tokens and Tailwind; match React Bits quality and Tailwind-first approach.

---

## 3. Pages & Required Interactions

### 3.1 Landing Page

- **Hero**: Headline (h1), subline, primary CTA “Begin Journey”, secondary “Learn More” / “About” / “Login”.
- **Background**: React Bits background (e.g. Aurora, Beams) with power-number colors; ensure text contrast.
- **Interactions**: CTA hover/focus states; optional Blur Text or Count Up for a stat (e.g. “12 chapters”).
- **Snippet (conceptual)**:

```tsx
<LandingLayout>
  <Aurora className="opacity-40" colors={[octave8, architect44]} />
  <Hero>
    <BlurText text="Your body's rhythm unlocks chapters" />
    <CountUp from={0} to={12} suffix=" chapters" />
    <Button variant="primary">Begin Journey</Button>
  </Hero>
</LandingLayout>
```

### 3.2 Dashboard (Post-Login)

- **Greeting**: “Good Morning, [Name]” (or time-based).
- **Today’s unlock**: One featured chapter card (unlocked or next); short copy (“Your intellectual cycle is peaking”).
- **Navigation**: Your Rhythms, Chapter Map, Library (and later Settings).
- **Interactions**: Cards clickable; optional hover animation (Glare Hover); status toasts for “Progress saved” etc.
- **Snippet**:

```tsx
<Dashboard>
  <StatusToast message="Progress saved" variant="success" />
  <Greeting />
  <UnlockSpotlight chapter={todayUnlock} />
  <NavLinks links={[{ to: "/rhythms", label: "Your Rhythms" }, { to: "/map", label: "Chapter Map" }, { to: "/library", label: "Library" }]} />
</Dashboard>
```

### 3.3 Biorhythm / Your Rhythms Page

- **Four bars**: Physical, Emotional, Intellectual, Spiritual; each with label, value (e.g. 0–100), optional icon.
- **Optional**: Small line/area chart for “last 7 days” per cycle.
- **Interactions**: Bars are read-only display (data from API); tooltip or popover on hover for “What is physical cycle?” if needed.
- **Snippet**:

```tsx
<BiorhythmPage>
  <h2>Your Rhythms Today</h2>
  {cycles.map((c) => (
    <BiorhythmBar key={c.id} label={c.label} value={c.value} icon={c.icon} />
  ))}
  <Button as={Link} to="/map">View Chapter Map</Button>
</BiorhythmPage>
```

### 3.4 Chapter Map Page

- **List or grid of chapter cards**: 12 chapters; show locked/unlocked, cycle badge, canticle duration.
- **Filters**: By cycle (physical, emotional, intellectual, spiritual).
- **Progress**: e.g. “7 of 12 unlocked” (Count Up or static).
- **Interactions**: Click card → if locked, show modal “Unlock when [condition]”; if unlocked, navigate to chapter or show preview. Optional popover for “Unlock in 13s” ceremony trigger.
- **Snippet**:

```tsx
<ChapterMap>
  <ProgressCounter current={unlockedCount} total={12} />
  <CycleFilter value={filter} onChange={setFilter} />
  <ChapterGrid>
    {chapters.map((ch) => (
      <ChapterCard key={ch.id} chapter={ch} onUnlock={openUnlockCeremony} onEnter={navigateToChapter} />
    ))}
  </ChapterGrid>
</ChapterMap>
```

### 3.5 Unlock Flow (Modal / Overlay)

- **Trigger**: From chapter map or dashboard “Unlock” action.
- **Phases (13s total)**: 0–3s pulse (8-beat); 3–6s color shift; 6–9s geometric expansion; 9–12s sound wave viz; 12–13s reveal + canticle preview.
- **Interactions**: Skip button (optional); after 13s, close overlay and mark chapter unlocked; toast “Chapter X unlocked”.
- **Components**: Custom sequence using motion tokens; visuals can use React Bits–inspired patterns (e.g. Particles, Ripple Grid) restyled with power-number palette.

### 3.6 Library / Canticle List

- **List of canticles**: Title, duration, chapter link, play/preview.
- **Interactions**: Play opens audio player (inline or bottom bar); progress bar for playback; optional waveform (design token for frequency colors: low/mid/high).
- **Counters**: “12 canticles”; “X listened”.

### 3.7 Settings & Profile

- **Forms**: Email, display name, password change; use React Bits Forms + tokens.
- **Notifications**: Toggles; save triggers status toast.
- **Danger zone**: Account actions; confirm via modal (use same Modal primitive).

### 3.8 Chat or Reflections (If Applicable)

- **Chat-style UI**: Message list + input; send triggers optimistic update + status (“Sending…” then “Saved” or error toast).
- **Bubbles**: User vs system; use surface-elevated and text-muted for differentiation; timestamps with caption token.
- **Interactions**: Scroll to bottom on new message; optional “Scroll to bottom” button when not at bottom.

---

## 4. Cross-Cutting Interaction Patterns

### 4.1 Pop-ups and Modals

- **Modal**: Overlay (backdrop) + centered panel; max-width for readability; header (optional), body, footer (actions). Close: overlay click, Escape, explicit “Cancel”.
- **Popover**: Anchor to trigger (e.g. “What’s this?”); dismiss on outside click or Escape. Use for tooltips and short help.
- **Confirm destructive action**: Modal with title, body, “Cancel” and “Delete” (or “Confirm”); primary danger button (life-125).

### 4.2 Status Messages (Toasts)

- **Placement**: Bottom-right or top-center; stack if multiple.
- **Variants**: success (world-21), warning (solar-19), error (life-125), info (architect-44).
- **Content**: Short message; optional action button; auto-dismiss after ~5s or user dismiss.
- **Interaction**: New toast pushes previous up or queues; avoid covering critical CTAs.

### 4.3 Counters and Numeric Display

- **Streak**: “7-day streak” — use Count Up (React Bits) for emphasis on first view.
- **Chapter progress**: “7 / 12” or “7 of 12 unlocked”.
- **Biorhythm values**: 0–100 with optional animation on load (Count Up or simple transition).

### 4.4 Bars and Progress

- **Progress bar**: Single bar; `value` 0–100; color from tokens (e.g. world-21); height 8px; border-radius from tokens.
- **Biorhythm bar**: Same primitive; label + optional icon left; value right or inside bar.
- **Playback bar**: Seekable; current time / duration; same token colors for “filled” portion.

### 4.5 Graphs and Charts

- **Biorhythm over time**: Line or area chart; one series per cycle; use power-number colors (octave-8, transform-13, solar-19, unity-152). Axis labels with caption token.
- **Simple stats**: E.g. “Chapters by cycle” — small bar or donut; same palette. Prefer a small, accessible chart library; style with tokens.
- **Interaction**: Tooltip on hover with value and date; ensure keyboard and screen-reader support.

### 4.6 Chat-Style Interactions

- **Message list**: Scrollable container; messages as bubbles (user right, system left or alternate).
- **Input**: Text field + Send button; disable Send when empty; “Sending…” state; on success, append message and clear input; on error, toast and keep input.
- **Optimistic update**: Append user message immediately; replace with “saved” or error state when server responds.

---

## 5. Code Conventions for Component Interaction

- **Tokens in components**: Use CSS variables or Tailwind theme that references the same token names (e.g. `bg-[var(--architect-44)]` or `theme('colors.architect.44')`).
- **Composition**: Pages compose compounds; compounds compose primitives. Avoid one-off inline styles; use token-driven classes.
- **React Bits**: When pulling a component via MCP, restyle with project tokens (replace hex in Tailwind classes or CSS with token vars). When building from scratch, use the same spacing, radius, and motion tokens so the result feels part of the same system.
- **State and feedback**: Loading → Loader (React Bits); success/error → Toast; confirmations → Modal. Keep interaction feedback consistent across pages.
- **Accessibility**: Focus management in modals; aria-live for toasts; labels for form inputs and chart regions; reduce-motion respect for motion tokens.

---

## 6. Summary Checklist

- **Design tokens**: Colors (power-number + semantic), typography, spacing (8px base), radius, motion (13s unlock, 300ms/150ms UI).
- **Components**: Primitives (Button, Input, Text, Icon), compounds (Card, Modal, Toast, ProgressBar, BiorhythmBar), patterns (Biorhythm dashboard, Chapter card, Unlock overlay).
- **React Bits**: Use or emulate Animations, Backgrounds, Text Animations, Buttons, Forms, Loaders; Tailwind-first; token override.
- **Pages**: Landing, Dashboard, Biorhythm, Chapter Map, Unlock flow, Library, Settings; optional Chat/Reflections.
- **Interactions**: Modals and popovers, toasts, counters (Count Up), bars and progress, simple charts, chat send/optimistic + toast.

This ecosystem document is the reference for implementing and wiring all UI so that Somatic-Canticles feels consistent, on-brand, and built on a single design system and component strategy aligned with React Bits and Cloudflare+Bun stack.
